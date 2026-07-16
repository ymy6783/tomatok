'use client';

/**
 * Soft constellation behind the hero — warm glow orbs, faint curved links,
 * mouse proximity lighting (listens on window so CTAs stay clickable).
 */

import { useEffect, useMemo, useRef, useState, useCallback, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Warm Tomatok palette — avoid purple “AI network” look */
const PALETTE = ['#E8453C', '#FF6B5A', '#FF8F7A', '#FFB39A', '#FFD4C4'] as const;
const COLOR_WEIGHTS = [0.22, 0.28, 0.24, 0.16, 0.1];
const GROWTH_DURATION = 4.6;
const MAX_CONNECTIONS = 72;
const CURVE_SEGMENTS = 12;
const MAX_PULSES = 8;
const MOUSE_RADIUS = 6.5;

interface ParticleData {
  id: number;
  position: THREE.Vector3;
  home: THREE.Vector3;
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

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
        const nz = (Math.random() - 0.5) * 0.18;
        return new THREE.Vector3(
          nx + (Math.random() - 0.5) * 0.03,
          ny + (Math.random() - 0.5) * 0.03,
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
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/* Soft bloom orb — not a hard circle outline */
const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    float core = exp(-dist * dist * 28.0);
    float halo = exp(-dist * dist * 6.5) * 0.55;
    float mist = exp(-dist * dist * 2.2) * 0.22;
    float a = (core + halo + mist) * vAlpha;
    if (a < 0.01) discard;
    vec3 col = vColor * (0.75 + core * 0.55);
    gl_FragColor = vec4(col, a);
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
    gl_FragColor = vec4(vColor, vAlpha * 0.85);
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

function PulseRing({
  born,
  origin,
  onDone,
}: {
  born: number;
  origin: THREE.Vector3;
  onDone: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const life = 1.8;
  useFrame((state) => {
    const t = (state.clock.elapsedTime - born) / life;
    if (t >= 1) {
      onDone();
      return;
    }
    if (ref.current) {
      const s = 0.35 + t * 5.5;
      ref.current.scale.set(s, s, s);
      ref.current.position.copy(origin);
    }
    if (matRef.current) matRef.current.opacity = (1 - t) * 0.1;
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.92, 1, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color="#FF8F7A"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function NetworkScene({
  logoMaskSrc,
  particleCount,
  align,
  mouseRef,
}: {
  logoMaskSrc: string;
  particleCount: number;
  align: 'left' | 'right' | 'center';
  mouseRef: MutableRefObject<{ x: number; y: number; active: boolean }>;
}) {
  const { viewport, camera } = useThree();
  const logoTargets = useLogoTargets(logoMaskSrc, particleCount);
  const targetQueue = useRef<THREE.Vector3[]>([]);
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0));
  const tmp = useRef(new THREE.Vector3());

  useEffect(() => {
    if (logoTargets) targetQueue.current = shuffle(logoTargets);
  }, [logoTargets]);

  const originRef = useRef(new THREE.Vector3(0, 0, 0));
  const boundsRef = useRef(6);
  useEffect(() => {
    const w = viewport.width;
    const h = viewport.height;
    const ox = align === 'left' ? -w * 0.22 : align === 'right' ? w * 0.22 : 0;
    originRef.current.set(ox, h * 0.04, 0);
    boundsRef.current = Math.min(w, h) * 0.34;
  }, [viewport.width, viewport.height, align]);

  const particles = useRef<ParticleData[]>([]);
  const connections = useRef<ConnectionData[]>([]);
  const pulses = useRef<PulseData[]>([]);
  const nextId = useRef(1);
  const spawnTimer = useRef(0);
  const spawnInterval = useRef(0.028);
  const pulseTimer = useRef(0);
  const waveTimer = useRef(0);
  const growing = useRef(true);
  const seeded = useRef(false);

  const [waves, setWaves] = useState<{ id: number; born: number }[]>([]);
  const removeWave = useCallback((id: number) => {
    setWaves((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const positions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const pColors = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const pSizes = useMemo(() => new Float32Array(particleCount), [particleCount]);
  const pAlphas = useMemo(() => new Float32Array(particleCount), [particleCount]);
  const pointsGeo = useRef<THREE.BufferGeometry>(null);

  const maxLineVerts = MAX_CONNECTIONS * CURVE_SEGMENTS * 2;
  const linePositions = useMemo(() => new Float32Array(maxLineVerts * 3), [maxLineVerts]);
  const lineColors = useMemo(() => new Float32Array(maxLineVerts * 3), [maxLineVerts]);
  const lineAlphas = useMemo(() => new Float32Array(maxLineVerts), [maxLineVerts]);
  const lineGeo = useRef<THREE.BufferGeometry>(null);

  const pulsePositions = useMemo(() => new Float32Array(MAX_PULSES * 3), []);
  const pulseColors = useMemo(() => new Float32Array(MAX_PULSES * 3), []);
  const pulseSizes = useMemo(() => new Float32Array(MAX_PULSES), []);
  const pulseAlphas = useMemo(() => new Float32Array(MAX_PULSES), []);
  const pulseGeo = useRef<THREE.BufferGeometry>(null);

  const findParticle = useCallback(
    (id: number) => particles.current.find((p) => p.id === id),
    []
  );

  const addConnection = useCallback((a: ParticleData, b: ParticleData, born: number) => {
    if (connections.current.length >= MAX_CONNECTIONS) return;
    const dx = b.position.x - a.position.x;
    const dy = b.position.y - a.position.y;
    const perp = new THREE.Vector3(-dy, dx, 0)
      .normalize()
      .multiplyScalar((Math.random() - 0.5) * 3.2);
    perp.z = (Math.random() - 0.5) * 0.6;
    connections.current.push({ aId: a.id, bId: b.id, bow: perp, born });
  }, []);

  const spawnParticle = useCallback(
    (elapsed: number) => {
      const list = particles.current;
      if (list.length >= particleCount) return;

      const pool = list.slice(Math.max(0, list.length - 16));
      const parent = pool.length ? pool[Math.floor(Math.random() * pool.length)] : list[0];
      if (!parent) return;

      const angle = Math.random() * Math.PI * 2;
      const dist = 0.55 + Math.random() * 1.5;
      const spawnPos = new THREE.Vector3(
        parent.position.x + Math.cos(angle) * dist,
        parent.position.y + Math.sin(angle) * dist,
        parent.position.z + (Math.random() - 0.5) * 0.9
      );

      const rel = spawnPos.clone().sub(originRef.current);
      if (rel.length() > boundsRef.current) {
        rel.setLength(boundsRef.current * (0.62 + Math.random() * 0.32));
        spawnPos.copy(originRef.current).add(rel);
      }

      const raw = targetQueue.current.pop();
      const target = raw
        ? raw.clone().multiplyScalar(boundsRef.current).add(originRef.current)
        : null;

      const isCore = Math.random() < 0.12;
      const p: ParticleData = {
        id: nextId.current++,
        position: spawnPos.clone(),
        home: (target ?? spawnPos).clone(),
        target,
        color: pickColor(),
        size: isCore ? 4.2 + Math.random() * 2.2 : 1.6 + Math.random() * 2.8,
        isCore,
        phase: Math.random() * Math.PI * 2,
        freq: 0.28 + Math.random() * 0.5,
        born: elapsed,
      };
      list.push(p);
      addConnection(parent, p, elapsed);

      if (Math.random() < 0.28 && list.length > 4) {
        const other = list[Math.floor(Math.random() * list.length)];
        if (
          other.id !== p.id &&
          other.position.distanceTo(p.position) < boundsRef.current * 0.42
        ) {
          addConnection(other, p, elapsed);
        }
      }
    },
    [addConnection, particleCount]
  );

  useFrame((state, dt) => {
    const elapsed = state.clock.elapsedTime;
    const clampedDt = Math.min(dt, 0.05);

    // Map normalized mouse (-1..1) into world at z≈0 plane
    if (mouseRef.current.active) {
      const v = tmp.current.set(mouseRef.current.x, mouseRef.current.y, 0.5);
      v.unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      mouseWorld.current.copy(camera.position).add(dir.multiplyScalar(dist));
    }

    if (!seeded.current) {
      seeded.current = true;
      const corePos = originRef.current.clone();
      particles.current.push({
        id: nextId.current++,
        position: corePos.clone(),
        home: corePos.clone(),
        target: null,
        color: new THREE.Color(PALETTE[0]),
        size: 6.5,
        isCore: true,
        phase: 0,
        freq: 0.42,
        born: elapsed,
      });
    }

    if (growing.current) {
      if (elapsed > GROWTH_DURATION || particles.current.length >= particleCount) {
        growing.current = false;
      } else {
        spawnTimer.current += clampedDt;
        if (spawnTimer.current > spawnInterval.current) {
          spawnTimer.current = 0;
          spawnInterval.current = 0.018 + Math.random() * 0.04;
          spawnParticle(elapsed);
        }
        waveTimer.current += clampedDt;
        if (waveTimer.current > 0.7) {
          waveTimer.current = 0;
          setWaves((prev) =>
            prev.length >= 2 ? prev : [...prev, { id: nextId.current++, born: elapsed }]
          );
        }
      }
    }

    const list = particles.current;
    const mouseOn = mouseRef.current.active;
    const mw = mouseWorld.current;

    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (p.target) {
        p.home.lerp(p.target, 0.04);
        if (p.home.distanceTo(p.target) < 0.04) p.target = null;
      }

      // Soft drift around home
      const fx = Math.sin(elapsed * p.freq + p.phase) * 0.16;
      const fy = Math.cos(elapsed * p.freq * 0.85 + p.phase) * 0.16;
      const desired = tmp.current.set(p.home.x + fx, p.home.y + fy, p.home.z);

      // Mouse: clear repulsion so motion is obvious
      if (mouseOn) {
        const dx = desired.x - mw.x;
        const dy = desired.y - mw.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        if (d < MOUSE_RADIUS) {
          const force = (1 - d / MOUSE_RADIUS) ** 1.6;
          desired.x += (dx / d) * force * 2.8;
          desired.y += (dy / d) * force * 2.8;
          desired.z += force * 0.55;
        }
      }

      p.position.lerp(desired, 0.18);

      const idx = i * 3;
      if (idx + 2 < positions.length) {
        positions[idx] = p.position.x;
        positions[idx + 1] = p.position.y;
        positions[idx + 2] = p.position.z;
        pColors[idx] = p.color.r;
        pColors[idx + 1] = p.color.g;
        pColors[idx + 2] = p.color.b;

        let near = 0;
        if (mouseOn) {
          const md = p.position.distanceTo(mw);
          near = Math.max(0, 1 - md / MOUSE_RADIUS);
        }
        pSizes[i] = p.size * (1 + near * 1.4);
        const age = Math.min(1, (elapsed - p.born) / 0.7);
        const baseA = p.isCore ? 0.85 : 0.34 + near * 0.55;
        pAlphas[i] = age * baseA;
      }
    }
    for (let i = list.length; i < particleCount; i++) pAlphas[i] = 0;

    if (pointsGeo.current) {
      (pointsGeo.current.getAttribute('position') as THREE.BufferAttribute).needsUpdate =
        true;
      (pointsGeo.current.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
      (pointsGeo.current.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
      (pointsGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }

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

      // Stronger curve — ribbon feel, not ruler lines
      const mid = a.position
        .clone()
        .add(b.position)
        .multiplyScalar(0.5)
        .add(conn.bow);
      mid.z += Math.sin(elapsed * 0.6 + conn.born) * 0.15;

      const age = Math.min(1, (elapsed - conn.born) / 1.1);
      let alpha = 0.06 + 0.08 * age;

      if (mouseOn) {
        const dA = a.position.distanceTo(mw);
        const dB = b.position.distanceTo(mw);
        const near = Math.max(0, 1 - Math.min(dA, dB) / MOUSE_RADIUS);
        alpha += near * 0.42;
      }

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

        // Soft gradient along the curve
        const mix = (t0 + t1) * 0.5;
        lineColors[vi] = a.color.r * (1 - mix) + b.color.r * mix;
        lineColors[vi + 1] = a.color.g * (1 - mix) + b.color.g * mix;
        lineColors[vi + 2] = a.color.b * (1 - mix) + b.color.b * mix;
        lineColors[vi + 3] = lineColors[vi];
        lineColors[vi + 4] = lineColors[vi + 1];
        lineColors[vi + 5] = lineColors[vi + 2];
        lineAlphas[baseA + s * 2] = alpha;
        lineAlphas[baseA + s * 2 + 1] = alpha;
      }
    }

    if (lineGeo.current) {
      (lineGeo.current.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.current.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }

    pulseTimer.current += clampedDt;
    if (
      pulseTimer.current > 0.45 + Math.random() * 0.5 &&
      conns.length > 0 &&
      pulses.current.length < MAX_PULSES
    ) {
      pulseTimer.current = 0;
      pulses.current.push({
        connIndex: Math.floor(Math.random() * Math.min(conns.length, MAX_CONNECTIONS)),
        t: 0,
        speed: 0.35 + Math.random() * 0.35,
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
      pl.t += clampedDt * pl.speed;
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
      pulseColors[idx] = 1;
      pulseColors[idx + 1] = 0.72;
      pulseColors[idx + 2] = 0.62;
      pulseSizes[i] = 2.2 + Math.sin(pl.t * Math.PI) * 2.4;
      pulseAlphas[i] = Math.sin(Math.min(1, pl.t) * Math.PI) * 0.7;
    }
    if (pulseGeo.current) {
      (pulseGeo.current.getAttribute('position') as THREE.BufferAttribute).needsUpdate =
        true;
      (pulseGeo.current.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
      (pulseGeo.current.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
      (pulseGeo.current.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <>
      {waves.map((w) => (
        <PulseRing
          key={w.id}
          born={w.born}
          origin={originRef.current}
          onDone={() => removeWave(w.id)}
        />
      ))}

      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={particleCount}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[pColors, 3]}
            count={particleCount}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[pSizes, 1]}
            count={particleCount}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[pAlphas, 1]}
            count={particleCount}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={lineGeo}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={maxLineVerts}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[lineColors, 3]}
            count={maxLineVerts}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[lineAlphas, 1]}
            count={maxLineVerts}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
            count={MAX_PULSES}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[pulseColors, 3]}
            count={MAX_PULSES}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[pulseSizes, 1]}
            count={MAX_PULSES}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[pulseAlphas, 1]}
            count={MAX_PULSES}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
        />
      </points>
    </>
  );
}

function quadBezier(a: THREE.Vector3, m: THREE.Vector3, b: THREE.Vector3, t: number) {
  const it = 1 - t;
  return new THREE.Vector3(
    it * it * a.x + 2 * it * t * m.x + t * t * b.x,
    it * it * a.y + 2 * it * t * m.y + t * t * b.y,
    it * it * a.z + 2 * it * t * m.z + t * t * b.z
  );
}

export interface HeroParticleNetworkProps {
  logoMaskSrc?: string;
  particleCount?: number;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export default function HeroParticleNetwork({
  logoMaskSrc = '/tomatok-logo-mask.svg',
  particleCount = 110,
  align = 'center',
  className,
}: HeroParticleNetworkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        mouseRef.current.active = false;
        return;
      }
      mouseRef.current.active = true;
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 90% at 50% 20%, #FFF8F5 0%, #FCFCFD 52%, #FCFCFD 100%)',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 22], fov: 42 }}
        style={{ width: '100%', height: '100%' }}
      >
        <NetworkScene
          logoMaskSrc={logoMaskSrc}
          particleCount={particleCount}
          align={align}
          mouseRef={mouseRef}
        />
      </Canvas>
    </div>
  );
}
