'use client';

/**
 * HeroParticleNetwork
 * --------------------
 * Self-contained, drop-in Hero background. Does not touch any existing
 * layout — mount it as an absolutely-positioned first child of a
 * `position: relative` Hero section, behind your existing header/text/buttons.
 *
 * Usage:
 *   import dynamic from 'next/dynamic';
 *   const HeroParticleNetwork = dynamic(() => import('@/components/HeroParticleNetwork'), { ssr: false });
 *
 *   <section style={{ position: 'relative' }}>
 *     <HeroParticleNetwork align="right" />
 *     <div style={{ position: 'relative', zIndex: 1 }}>
 *       ...existing header / copy / buttons, unchanged...
 *     </div>
 *   </section>
 *
 * Requires: three, @react-three/fiber, @react-three/drei
 * Expects a shape-reference image at /public/tomatok-logo-mask.png
 * (PNG with alpha, or a dark silhouette on a light/transparent field).
 * The image is only sampled for coordinates — it is never rendered.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ---------------------------------------------------------------- */
/* Config                                                            */
/* ---------------------------------------------------------------- */

const PALETTE = ['#FF8A65', '#FF6F91', '#F38AD3', '#B39DFF', '#82B1FF'] as const;
const COLOR_WEIGHTS = [0.27, 0.26, 0.22, 0.13, 0.12];
const GROWTH_DURATION = 5.2;
const MAX_CONNECTIONS = 130;
const CURVE_SEGMENTS = 8;
const MAX_PULSES = 10;

interface ParticleData {
  id: number;
  position: THREE.Vector3;
  target: THREE.Vector3 | null;
  color: THREE.Color;
  size: number;
  isCore: boolean;
  phase: number;
  freq: number;
  born: number;
}

interface ConnectionData {
  aId: number;
  bId: number;
  bow: THREE.Vector3;
  born: number;
}

interface PulseData {
  connIndex: number;
  t: number;
  speed: number;
}

/* ---------------------------------------------------------------- */
/* Logo silhouette sampling                                          */
/* ---------------------------------------------------------------- */

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Loads the mask image, samples alpha/brightness, returns normalized
 *  (-1..1) target points. Never renders the image itself. */
function useLogoTargets(src: string, count: number) {
  const [targets, setTargets] = useState<THREE.Vector3[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      const size = 180;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

      const data = ctx.getImageData(0, 0, size, size).data;
      const candidates: { x: number; y: number }[] = [];

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const alpha = data[i + 3];
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Prefer real alpha; fall back to "dark pixel = shape" for opaque images.
          const w2 = alpha > 10 ? alpha / 255 : lum < 200 ? 1 - lum / 255 : 0;
          if (w2 > 0.2) candidates.push({ x, y });
        }
      }

      if (candidates.length === 0) {
        setTargets(null);
        return;
      }

      const picked = shuffle(candidates).slice(0, count);
      const pts = picked.map((p) => {
        const nx = (p.x / size - 0.5) * 2;
        const ny = -(p.y / size - 0.5) * 2;
        const nz = (Math.random() - 0.5) * 0.12;
        // small per-point jitter so the silhouette isn't grid-hard
        return new THREE.Vector3(
          nx + (Math.random() - 0.5) * 0.02,
          ny + (Math.random() - 0.5) * 0.02,
          nz
        );
      });
      setTargets(pts);
    };

    img.onerror = () => {
      if (!cancelled) setTargets(null);
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, count]);

  return targets;
}

/* ---------------------------------------------------------------- */
/* Shaders — soft glowing point sprites (no post-process blur)       */
/* ---------------------------------------------------------------- */

const particleVertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    float core = smoothstep(0.16, 0.0, dist);
    float glow = smoothstep(0.5, 0.05, dist) * 0.5;
    float a = clamp(core + glow, 0.0, 1.0) * vAlpha;
    if (a < 0.008) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const lineVertexShader = `
  attribute float aAlpha;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

function pickColor(): THREE.Color {
  let r = Math.random();
  let acc = 0;
  for (let i = 0; i < PALETTE.length; i++) {
    acc += COLOR_WEIGHTS[i];
    if (r <= acc) return new THREE.Color(PALETTE[i]);
  }
  return new THREE.Color(PALETTE[0]);
}

/* ---------------------------------------------------------------- */
/* Expanding pulse ring (visual only — spawns from the core)         */
/* ---------------------------------------------------------------- */

function PulseRing({ born, origin, onDone }: { born: number; origin: THREE.Vector3; onDone: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const life = 1.4;
  useFrame((state) => {
    const t = (state.clock.elapsedTime - born) / life;
    if (t >= 1) {
      onDone();
      return;
    }
    if (ref.current) {
      const s = 0.4 + t * 6;
      ref.current.scale.set(s, s, s);
      ref.current.position.copy(origin);
    }
    if (matRef.current) matRef.current.opacity = (1 - t) * 0.16;
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.85, 1, 48]} />
      <meshBasicMaterial ref={matRef} color="#FFB199" transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ---------------------------------------------------------------- */
/* Core simulation + rendering                                       */
/* ---------------------------------------------------------------- */

function NetworkScene({
  logoMaskSrc,
  particleCount,
  align,
}: {
  logoMaskSrc: string;
  particleCount: number;
  align: 'left' | 'right' | 'center';
}) {
  const { viewport } = useThree();
  const logoTargets = useLogoTargets(logoMaskSrc, particleCount);
  const targetQueue = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    if (logoTargets) targetQueue.current = shuffle(logoTargets);
  }, [logoTargets]);

  const originRef = useRef(new THREE.Vector3(0, 0, 0));
  const boundsRef = useRef(6);
  useEffect(() => {
    const w = viewport.width;
    const h = viewport.height;
    const ox = align === 'left' ? -w * 0.22 : align === 'right' ? w * 0.22 : 0;
    originRef.current.set(ox, 0, 0);
    boundsRef.current = Math.min(w, h) * 0.3;
  }, [viewport.width, viewport.height, align]);

  const particles = useRef<ParticleData[]>([]);
  const connections = useRef<ConnectionData[]>([]);
  const pulses = useRef<PulseData[]>([]);
  const nextId = useRef(1);
  const spawnTimer = useRef(0);
  const spawnInterval = useRef(0.03);
  const pulseTimer = useRef(0);
  const waveTimer = useRef(0);
  const growing = useRef(true);

  const [waves, setWaves] = useState<{ id: number; born: number }[]>([]);
  const removeWave = useCallback((id: number) => {
    setWaves((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Seed the single core particle once.
  const seeded = useRef(false);

  // Geometry buffers for particles
  const positions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const pColors = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const pSizes = useMemo(() => new Float32Array(particleCount), [particleCount]);
  const pAlphas = useMemo(() => new Float32Array(particleCount), [particleCount]);
  const pointsGeo = useRef<THREE.BufferGeometry>(null);

  // Geometry buffers for connection curves (line segments, CURVE_SEGMENTS per curve)
  const maxLineVerts = MAX_CONNECTIONS * CURVE_SEGMENTS * 2;
  const linePositions = useMemo(() => new Float32Array(maxLineVerts * 3), [maxLineVerts]);
  const lineColors = useMemo(() => new Float32Array(maxLineVerts * 3), [maxLineVerts]);
  const lineAlphas = useMemo(() => new Float32Array(maxLineVerts), [maxLineVerts]);
  const lineGeo = useRef<THREE.BufferGeometry>(null);

  // Geometry buffers for traveling message pulses
  const pulsePositions = useMemo(() => new Float32Array(MAX_PULSES * 3), []);
  const pulseColors = useMemo(() => new Float32Array(MAX_PULSES * 3), []);
  const pulseSizes = useMemo(() => new Float32Array(MAX_PULSES), []);
  const pulseAlphas = useMemo(() => new Float32Array(MAX_PULSES), []);
  const pulseGeo = useRef<THREE.BufferGeometry>(null);

  const findParticle = useCallback((id: number) => particles.current.find((p) => p.id === id), []);

  const addConnection = useCallback((a: ParticleData, b: ParticleData, born: number) => {
    if (connections.current.length >= MAX_CONNECTIONS) return;
    const perp = new THREE.Vector3(-(b.position.y - a.position.y), b.position.x - a.position.x, 0)
      .normalize()
      .multiplyScalar((Math.random() - 0.5) * 2.5);
    connections.current.push({ aId: a.id, bId: b.id, bow: perp, born });
  }, []);

  const spawnParticle = useCallback(
    (elapsed: number) => {
      const list = particles.current;
      if (list.length >= particleCount) return;

      const pool = list.slice(Math.max(0, list.length - 14));
      const parent = pool.length ? pool[Math.floor(Math.random() * pool.length)] : list[0];
      if (!parent) return;

      const angle = Math.random() * Math.PI * 2;
      const dist = 0.6 + Math.random() * 1.6;
      const spawnPos = new THREE.Vector3(
        parent.position.x + Math.cos(angle) * dist,
        parent.position.y + Math.sin(angle) * dist,
        parent.position.z + (Math.random() - 0.5) * 0.8
      );

      const rel = spawnPos.clone().sub(originRef.current);
      if (rel.length() > boundsRef.current) {
        rel.setLength(boundsRef.current * (0.65 + Math.random() * 0.3));
        spawnPos.copy(originRef.current).add(rel);
      }

      const raw = targetQueue.current.pop();
      const target = raw ? raw.clone().multiplyScalar(boundsRef.current).add(originRef.current) : null;

      const isCore = Math.random() < 0.14;
      const p: ParticleData = {
        id: nextId.current++,
        position: spawnPos,
        target,
        color: pickColor(),
        size: isCore ? 3.4 + Math.random() * 1.6 : 1 + Math.random() * 2,
        isCore,
        phase: Math.random() * Math.PI * 2,
        freq: 0.35 + Math.random() * 0.55,
        born: elapsed,
      };
      list.push(p);
      addConnection(parent, p, elapsed);

      // occasional extra connection to another nearby particle
      if (Math.random() < 0.35 && list.length > 3) {
        const other = list[Math.floor(Math.random() * list.length)];
        if (other.id !== p.id && other.position.distanceTo(p.position) < boundsRef.current * 0.5) {
          addConnection(other, p, elapsed);
        }
      }
    },
    [addConnection, particleCount]
  );

  useFrame((state, dt) => {
    const elapsed = state.clock.elapsedTime;

    // --- seed core particle ---
    if (!seeded.current) {
      seeded.current = true;
      particles.current.push({
        id: nextId.current++,
        position: originRef.current.clone(),
        target: null,
        color: new THREE.Color(PALETTE[0]),
        size: 5,
        isCore: true,
        phase: 0,
        freq: 0.5,
        born: elapsed,
      });
    }

    // --- growth phase: spawn particles + pulse rings ---
    if (growing.current) {
      if (elapsed > GROWTH_DURATION || particles.current.length >= particleCount) {
        growing.current = false;
      } else {
        spawnTimer.current += dt;
        if (spawnTimer.current > spawnInterval.current) {
          spawnTimer.current = 0;
          spawnInterval.current = 0.02 + Math.random() * 0.045;
          spawnParticle(elapsed);
        }
        waveTimer.current += dt;
        if (waveTimer.current > 0.55) {
          waveTimer.current = 0;
          setWaves((prev) => (prev.length >= 3 ? prev : [...prev, { id: nextId.current++, born: elapsed }]));
        }
      }
    }

    // --- update particle positions (ease to target + floating jitter) ---
    const list = particles.current;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (p.target) {
        p.position.lerp(p.target, 0.035);
      }
      const fx = Math.sin(elapsed * p.freq + p.phase) * 0.12;
      const fy = Math.cos(elapsed * p.freq * 0.8 + p.phase) * 0.12;
      const idx = i * 3;
      if (idx + 2 < positions.length) {
        positions[idx] = p.position.x + fx;
        positions[idx + 1] = p.position.y + fy;
        positions[idx + 2] = p.position.z;
        pColors[idx] = p.color.r;
        pColors[idx + 1] = p.color.g;
        pColors[idx + 2] = p.color.b;
        pSizes[i] = p.size;
        const age = Math.min(1, (elapsed - p.born) / 0.6);
        pAlphas[i] = age * (p.isCore ? 0.95 : 0.6 + Math.random() * 0.15);
      }
    }
    for (let i = list.length; i < particleCount; i++) {
      pAlphas[i] = 0;
    }
    if (pointsGeo.current) {
      const posAttr = pointsGeo.current.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = pointsGeo.current.getAttribute('aColor') as THREE.BufferAttribute;
      const sizeAttr = pointsGeo.current.getAttribute('aSize') as THREE.BufferAttribute;
      const alphaAttr = pointsGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    }

    // --- update connection curves ---
    const conns = connections.current;
    for (let c = 0; c < MAX_CONNECTIONS; c++) {
      const base = c * CURVE_SEGMENTS * 2 * 3;
      const baseA = c * CURVE_SEGMENTS * 2;
      if (c >= conns.length) {
        for (let s = 0; s < CURVE_SEGMENTS * 2; s++) lineAlphas[baseA + s] = 0;
        continue;
      }
      const conn = conns[c];
      const a = findParticle(conn.aId);
      const b = findParticle(conn.bId);
      if (!a || !b) {
        for (let s = 0; s < CURVE_SEGMENTS * 2; s++) lineAlphas[baseA + s] = 0;
        continue;
      }
      const mid = a.position.clone().add(b.position).multiplyScalar(0.5).add(conn.bow);
      const age = Math.min(1, (elapsed - conn.born) / 0.8);
      const breathe = 0.7 + 0.3 * Math.sin(elapsed * 0.9 + conn.born * 3.1);
      const alpha = 0.05 + (0.13 * age * breathe);

      for (let s = 0; s < CURVE_SEGMENTS; s++) {
        const t0 = s / CURVE_SEGMENTS;
        const t1 = (s + 1) / CURVE_SEGMENTS;
        const p0 = quadBezier(a.position, mid, b.position, t0);
        const p1 = quadBezier(a.position, mid, b.position, t1);
        const vi = base + s * 2 * 3;
        linePositions[vi] = p0.x;
        linePositions[vi + 1] = p0.y;
        linePositions[vi + 2] = p0.z;
        linePositions[vi + 3] = p1.x;
        linePositions[vi + 4] = p1.y;
        linePositions[vi + 5] = p1.z;
        lineColors[vi] = a.color.r;
        lineColors[vi + 1] = a.color.g;
        lineColors[vi + 2] = a.color.b;
        lineColors[vi + 3] = b.color.r;
        lineColors[vi + 4] = b.color.g;
        lineColors[vi + 5] = b.color.b;
        lineAlphas[baseA + s * 2] = alpha;
        lineAlphas[baseA + s * 2 + 1] = alpha;
      }
    }
    if (lineGeo.current) {
      const posAttr = lineGeo.current.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = lineGeo.current.getAttribute('aColor') as THREE.BufferAttribute;
      const alphaAttr = lineGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    }

    // --- traveling message pulses along random connections ---
    pulseTimer.current += dt;
    if (pulseTimer.current > 0.35 + Math.random() * 0.4 && conns.length > 0 && pulses.current.length < MAX_PULSES) {
      pulseTimer.current = 0;
      pulses.current.push({
        connIndex: Math.floor(Math.random() * Math.min(conns.length, MAX_CONNECTIONS)),
        t: 0,
        speed: 0.5 + Math.random() * 0.4,
      });
    }
    pulses.current = pulses.current.filter((pl) => pl.t < 1);
    for (let i = 0; i < MAX_PULSES; i++) {
      const idx = i * 3;
      if (i >= pulses.current.length) {
        pulseAlphas[i] = 0;
        continue;
      }
      const pl = pulses.current[i];
      pl.t += dt * pl.speed;
      const conn = conns[pl.connIndex];
      const a = conn ? findParticle(conn.aId) : null;
      const b = conn ? findParticle(conn.bId) : null;
      if (!conn || !a || !b) {
        pulseAlphas[i] = 0;
        continue;
      }
      const mid = a.position.clone().add(b.position).multiplyScalar(0.5).add(conn.bow);
      const pos = quadBezier(a.position, mid, b.position, Math.min(1, pl.t));
      pulsePositions[idx] = pos.x;
      pulsePositions[idx + 1] = pos.y;
      pulsePositions[idx + 2] = pos.z;
      pulseColors[idx] = a.color.r;
      pulseColors[idx + 1] = a.color.g;
      pulseColors[idx + 2] = a.color.b;
      pulseSizes[i] = 3;
      pulseAlphas[i] = Math.sin(Math.min(1, pl.t) * Math.PI) * 0.9;
    }
    if (pulseGeo.current) {
      const posAttr = pulseGeo.current.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = pulseGeo.current.getAttribute('aColor') as THREE.BufferAttribute;
      const sizeAttr = pulseGeo.current.getAttribute('aSize') as THREE.BufferAttribute;
      const alphaAttr = pulseGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {waves.map((w) => (
        <PulseRing key={w.id} born={w.born} origin={originRef.current} onDone={() => removeWave(w.id)} />
      ))}

      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={particleCount} />
          <bufferAttribute attach="attributes-aColor" args={[pColors, 3]} count={particleCount} />
          <bufferAttribute attach="attributes-aSize" args={[pSizes, 1]} count={particleCount} />
          <bufferAttribute attach="attributes-aAlpha" args={[pAlphas, 1]} count={particleCount} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={lineGeo}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={maxLineVerts} />
          <bufferAttribute attach="attributes-aColor" args={[lineColors, 3]} count={maxLineVerts} />
          <bufferAttribute attach="attributes-aAlpha" args={[lineAlphas, 1]} count={maxLineVerts} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} count={MAX_PULSES} />
          <bufferAttribute attach="attributes-aColor" args={[pulseColors, 3]} count={MAX_PULSES} />
          <bufferAttribute attach="attributes-aSize" args={[pulseSizes, 1]} count={MAX_PULSES} />
          <bufferAttribute attach="attributes-aAlpha" args={[pulseAlphas, 1]} count={MAX_PULSES} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
        />
      </points>
    </>
  );
}

function quadBezier(a: THREE.Vector3, m: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const it = 1 - t;
  return new THREE.Vector3(
    it * it * a.x + 2 * it * t * m.x + t * t * b.x,
    it * it * a.y + 2 * it * t * m.y + t * t * b.y,
    it * it * a.z + 2 * it * t * m.z + t * t * b.z
  );
}

/* ---------------------------------------------------------------- */
/* Public component                                                  */
/* ---------------------------------------------------------------- */

export interface HeroParticleNetworkProps {
  /** Path to the shape-reference image (never displayed, only sampled). */
  logoMaskSrc?: string;
  /** Total number of particles the network grows to. */
  particleCount?: number;
  /** Which side of the Hero the network anchors toward. */
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export default function HeroParticleNetwork({
  logoMaskSrc = '/tomatok-logo-mask.svg',
  particleCount = 140,
  align = 'center',
  className,
}: HeroParticleNetworkProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          'radial-gradient(130% 130% at 72% 28%, #FFF6F1 0%, #FCFCFD 55%, #FCFCFD 100%)',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 22], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <NetworkScene logoMaskSrc={logoMaskSrc} particleCount={particleCount} align={align} />
      </Canvas>
    </div>
  );
}
