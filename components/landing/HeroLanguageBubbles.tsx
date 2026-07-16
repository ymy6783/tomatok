'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Bubble = {
  id: string;
  text: string;
  x: number;
  y: number;
  rotate: number;
  size: 'sm' | 'md' | 'lg';
};

const BUBBLES: Bubble[] = [
  { id: 'ko', text: '안녕하세요', x: 22, y: 28, rotate: -5, size: 'lg' },
  { id: 'en', text: 'Hello!', x: 72, y: 26, rotate: 4, size: 'md' },
  { id: 'ja', text: 'こんにちは', x: 18, y: 52, rotate: 3, size: 'md' },
  { id: 'vi', text: 'Xin chào', x: 76, y: 50, rotate: -4, size: 'lg' },
  { id: 'zh', text: '你好', x: 28, y: 70, rotate: -2, size: 'sm' },
  { id: 'es', text: '¡Hola!', x: 70, y: 68, rotate: 5, size: 'md' },
  { id: 'fr', text: 'Bonjour', x: 48, y: 22, rotate: -3, size: 'sm' },
  { id: 'th', text: 'สวัสดี', x: 82, y: 38, rotate: 2, size: 'sm' },
  { id: 'ar', text: 'مرحبا', x: 38, y: 76, rotate: 4, size: 'md' },
  { id: 'de', text: 'Hallo', x: 16, y: 40, rotate: 2, size: 'sm' },
  { id: 'id', text: 'Halo', x: 58, y: 32, rotate: -6, size: 'sm' },
  { id: 'pt', text: 'Olá!', x: 62, y: 74, rotate: -3, size: 'sm' },
];

/* Side cluster only — never over the title column */
const MOBILE_BUBBLES: Bubble[] = [
  { id: 'ko', text: '안녕하세요', x: 8, y: 14, rotate: -5, size: 'sm' },
  { id: 'en', text: 'Hello!', x: 92, y: 13, rotate: 4, size: 'sm' },
  { id: 'ja', text: 'こんにちは', x: 6, y: 24, rotate: 3, size: 'sm' },
  { id: 'vi', text: 'Xin chào', x: 94, y: 23, rotate: -4, size: 'sm' },
];

/** Conversation pairs — “same greeting across languages” */
const ECHO_PAIRS: [string, string][] = [
  ['ko', 'en'],
  ['en', 'vi'],
  ['ja', 'zh'],
  ['fr', 'es'],
  ['ko', 'ja'],
  ['vi', 'th'],
  ['de', 'en'],
  ['ar', 'pt'],
];

type Motion = {
  dx: number;
  dy: number;
  opacity: number;
  scale: number;
  rot: number;
  enter: number;
  echo: number;
};

type Beam = {
  key: number;
  from: number;
  to: number;
  t: number;
};

type FloatSpec = {
  phase: number;
  bobAmp: number;
  swayAmp: number;
  bobSpeed: number;
  swaySpeed: number;
  driftAmp: number;
  driftSpeed: number;
  wobble: number;
};

function useIsMobile(maxWidth = 860) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [maxWidth]);
  return mobile;
}

function hash01(id: string, salt = '') {
  let h = 0;
  const s = id + salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

function hashAngle(id: string) {
  return hash01(id) * Math.PI * 2;
}

function makeFloat(id: string, mobile: boolean): FloatSpec {
  const n = hash01(id, 'f');
  const n2 = hash01(id, 'g');
  const n3 = hash01(id, 'h');
  const scale = mobile ? 0.22 : 1;
  return {
    phase: hashAngle(id),
    bobAmp: (10 + n * 10) * scale,
    swayAmp: (8 + n2 * 10) * scale,
    bobSpeed: 0.55 + n * 0.45,
    swaySpeed: 0.4 + n2 * 0.35,
    driftAmp: (6 + n3 * 8) * scale,
    driftSpeed: 0.18 + n3 * 0.16,
    wobble: (1.5 + n * 2.5) * (n2 > 0.5 ? 1 : -1),
  };
}

export default function HeroLanguageBubbles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const bubbles = useMemo(
    () => (isMobile ? MOBILE_BUBBLES : BUBBLES),
    [isMobile]
  );

  const mouse = useRef({ x: 0.5, y: 0.5, active: false });
  const scatter = useRef(
    bubbles.map((b) => ({
      progress: 0,
      angle: hashAngle(b.id),
      dist: 12 + hash01(b.id, 'd') * 18,
    }))
  );
  const floats = useRef(bubbles.map((b) => makeFloat(b.id, isMobile)));
  const enter = useRef(bubbles.map(() => 0));
  const echo = useRef(bubbles.map(() => 0));
  const pos = useRef(bubbles.map((b) => ({ x: b.x, y: b.y })));
  const beams = useRef<Beam[]>([]);
  const beamKey = useRef(0);
  const echoTimer = useRef(0);
  const started = useRef(0);
  const [motions, setMotions] = useState<Motion[]>(() =>
    bubbles.map(() => ({
      dx: 0,
      dy: 0,
      opacity: 0,
      scale: 0.85,
      rot: 0,
      enter: 0,
      echo: 0,
    }))
  );
  const [beamView, setBeamView] = useState<Beam[]>([]);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const rafRef = useRef(0);

  useEffect(() => {
    scatter.current = bubbles.map((b) => ({
      progress: 0,
      angle: hashAngle(b.id),
      dist: 12 + hash01(b.id, 'd') * 18,
    }));
    floats.current = bubbles.map((b) => makeFloat(b.id, isMobile));
    enter.current = bubbles.map(() => 0);
    echo.current = bubbles.map(() => 0);
    pos.current = bubbles.map((b) => ({ x: b.x, y: b.y }));
    beams.current = [];
    started.current = performance.now();
    setMotions(
      bubbles.map(() => ({
        dx: 0,
        dy: 0,
        opacity: 0,
        scale: 0.85,
        rot: 0,
        enter: 0,
        echo: 0,
      }))
    );
  }, [bubbles, isMobile]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const fx = el.closest('.landing-hero-fx') as HTMLElement | null;
    const syncBounds = () => {
      const hero = document.querySelector('.hero') as HTMLElement | null;
      if (fx && hero) {
        fx.style.height = `${hero.offsetHeight}px`;
      }
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height || window.innerHeight });
    };
    syncBounds();
    window.addEventListener('resize', syncBounds, { passive: true });
    const ro = new ResizeObserver(syncBounds);
    const hero = document.querySelector('.hero');
    if (hero) ro.observe(hero);
    ro.observe(el);

    const idIndex = (id: string) => bubbles.findIndex((b) => b.id === id);

    const tick = (now: number) => {
      const elapsed = (now - started.current) / 1000;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const active = mouse.current.active;
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      const w = rect.width || 1;

      bubbles.forEach((_, i) => {
        const delay = 0.12 + i * 0.09;
        const t = Math.min(1, Math.max(0, (elapsed - delay) / 0.7));
        enter.current[i] += (t - enter.current[i]) * 0.12;
      });

      echoTimer.current += 1 / 60;
      if (echoTimer.current > 2.8 && beams.current.length < 2) {
        echoTimer.current = 0;
        const pair =
          ECHO_PAIRS[Math.floor(Math.random() * ECHO_PAIRS.length)];
        const from = idIndex(pair[0]);
        const to = idIndex(pair[1]);
        if (from >= 0 && to >= 0) {
          beams.current.push({
            key: ++beamKey.current,
            from,
            to,
            t: 0,
          });
          echo.current[from] = 1;
        }
      }

      beams.current = beams.current
        .map((beam) => {
          const nt = beam.t + 0.012;
          if (nt >= 1) {
            echo.current[beam.to] = 1;
            return null;
          }
          return { ...beam, t: nt };
        })
        .filter(Boolean) as Beam[];

      echo.current = echo.current.map((v) => v * 0.92);

      let hit = -1;
      if (active) {
        let best = Infinity;
        const hitR = isMobile ? 0.11 : 0.09;
        bubbles.forEach((_, i) => {
          const p = pos.current[i];
          const d = Math.hypot(p.x / 100 - mx, p.y / 100 - my);
          if (d < hitR && d < best) {
            best = d;
            hit = i;
          }
        });
      }

      const next = bubbles.map((b, i) => {
        const s = scatter.current[i];
        const f = floats.current[i];
        const near = i === hit;
        const target = near ? 1 : 0;
        const speed = near ? 0.035 : 0.045;
        s.progress += (target - s.progress) * speed;

        const p = s.progress;
        const e = p * p * (3 - 2 * p);

        const bob =
          Math.sin(elapsed * f.bobSpeed + f.phase) * f.bobAmp +
          Math.sin(elapsed * f.bobSpeed * 1.7 + f.phase * 0.6) *
            f.bobAmp *
            0.28;
        const sway =
          Math.cos(elapsed * f.swaySpeed + f.phase * 1.2) * f.swayAmp +
          Math.sin(elapsed * f.driftSpeed + f.phase) * f.driftAmp;
        const driftY =
          Math.cos(elapsed * f.driftSpeed * 0.9 + f.phase * 1.7) *
          f.driftAmp *
          0.7;

        let dx = sway + Math.cos(s.angle) * s.dist * e * 0.45;
        let dy =
          bob +
          driftY -
          e * (22 + s.dist * 0.35) +
          Math.sin(s.angle) * s.dist * e * 0.25;

        const en = enter.current[i];
        const enE = en * en * (3 - 2 * en);
        dy += (1 - enE) * 16;

        let nx = 0;
        let ny = 0;
        const neighborR = isMobile ? 110 : 140;
        const neighborMid = isMobile ? 70 : 90;
        const neighborForce = isMobile ? 0.55 : 0.35;
        for (let j = 0; j < bubbles.length; j++) {
          if (j === i) continue;
          const other = bubbles[j];
          const ox = ((other.x - b.x) / 100) * w;
          const oy = ((other.y - b.y) / 100) * h;
          const dist = Math.hypot(ox, oy) || 1;
          if (dist < neighborR) {
            const force = ((dist - neighborMid) / neighborMid) * neighborForce;
            nx += (ox / dist) * force;
            ny += (oy / dist) * force;
          }
        }
        dx += nx * (1 - e);
        dy += ny * (1 - e);

        const ec = echo.current[i];
        const opacity = Math.min(1, enE) * (1 - e * 0.92);
        const scale =
          (0.88 + enE * 0.12) * (1 + e * 0.12) * (1 + ec * 0.08);
        const rot =
          Math.sin(elapsed * 0.7 + f.phase) * f.wobble +
          e * 6 * (i % 2 === 0 ? 1 : -1);

        if (isMobile) {
          const baseTop = (b.y / 100) * h;
          const minTop = h * 0.08;
          const maxTop = h * 0.28;
          dy = Math.max(minTop - baseTop, Math.min(dy, maxTop - baseTop));
          // Keep away from the center title column
          const sidePush = b.x < 50 ? -1 : 1;
          const centerClear = Math.max(0, 0.28 - Math.abs(b.x / 100 - 0.5));
          dx += sidePush * centerClear * w * 0.12;
        }

        pos.current[i] = {
          x: b.x + (dx / w) * 100,
          y: b.y + (dy / h) * 100,
        };

        return {
          dx,
          dy,
          opacity,
          scale,
          rot,
          enter: enE,
          echo: ec,
        };
      });

      setMotions(next);
      setBeamView([...beams.current]);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      mouse.current.active = inside;
      if (inside) {
        mouse.current.x = (e.clientX - r.left) / r.width;
        mouse.current.y = (e.clientY - r.top) / r.height;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', syncBounds);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (fx) fx.style.height = '';
    };
  }, [bubbles, isMobile]);

  return (
    <div ref={wrapRef} className="hero-bubbles" aria-hidden="true">
      <svg className="hero-bubble-beams" width={size.w} height={size.h}>
        {beamView.map((beam) => {
          const a = pos.current[beam.from] ?? bubbles[beam.from];
          const b = pos.current[beam.to] ?? bubbles[beam.to];
          if (!a || !b) return null;
          const x1 = (a.x / 100) * size.w;
          const y1 = (a.y / 100) * size.h;
          const x2 = (b.x / 100) * size.w;
          const y2 = (b.y / 100) * size.h;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - 40;
          const t = beam.t;
          const it = 1 - t;
          const px = it * it * x1 + 2 * it * t * mx + t * t * x2;
          const py = it * it * y1 + 2 * it * t * my + t * t * y2;
          const fade = Math.sin(t * Math.PI);
          return (
            <g key={beam.key}>
              <path
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none"
                stroke="#E8453C"
                strokeWidth={1.25}
                strokeOpacity={0.12 + fade * 0.22}
                strokeDasharray="4 8"
              />
              <circle
                cx={px}
                cy={py}
                r={3.5}
                fill="#E8453C"
                opacity={0.35 + fade * 0.45}
              />
            </g>
          );
        })}
      </svg>

      {bubbles.map((b, i) => {
        const m = motions[i] ?? {
          dx: 0,
          dy: 0,
          opacity: 0,
          scale: 0.85,
          rot: 0,
          enter: 0,
          echo: 0,
        };
        return (
          <div
            key={b.id}
            className={`hero-bubble hero-bubble--${b.size}${m.echo > 0.2 ? ' is-echo' : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              opacity: m.opacity,
              transform: `translate(-50%, -50%) translate(${m.dx}px, ${m.dy}px) rotate(${b.rotate + m.rot}deg) scale(${m.scale})`,
            }}
          >
            <span className="hero-bubble-text">{b.text}</span>
          </div>
        );
      })}
    </div>
  );
}
