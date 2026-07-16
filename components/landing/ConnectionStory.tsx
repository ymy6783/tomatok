'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locale';

const COPY = {
  ko: {
    eyebrow: '01. Connection',
    headline: ['Beyond Borders,', 'Beyond Languages.'],
    sub: '단 하나의 메신저로 연결되는 세상.',
    points: [
      {
        keyword: '0.5s Real-time',
        rest: '번역 앱 없이, 말하는 순간 0.5초 만에 전달되는 진심',
      },
      {
        keyword: '120+ Languages',
        rest: '전 세계 친구들과 장벽 없이 공유하는 일상',
      },
      {
        keyword: 'Effortless Connection',
        rest: '언어를 배우는 수고 대신, 더 깊은 대화에 집중',
      },
    ],
    imgAlt: '세계 곳곳의 친구들과 함께하는 토마톡',
  },
  en: {
    eyebrow: '01. Connection',
    headline: ['Beyond Borders,', 'Beyond Languages.'],
    sub: 'A world connected by one messenger.',
    points: [
      {
        keyword: '0.5s Real-time',
        rest: 'Your meaning arrives in 0.5s—no translation app needed.',
      },
      {
        keyword: '120+ Languages',
        rest: 'Share everyday life with friends around the world.',
      },
      {
        keyword: 'Effortless Connection',
        rest: 'Skip the language grind. Focus on deeper conversation.',
      },
    ],
    imgAlt: 'Friends around the world with Tomatok',
  },
} as const;

export default function ConnectionStory({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const gridRef = useRef<HTMLUListElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="story" id="story">
      <div className="story-inner">
        <span className="eyebrow story-eyebrow">{t.eyebrow}</span>
        <h2 className="story-headline">
          {t.headline[0]}
          <br />
          {t.headline[1]}
        </h2>
        <p className="story-sub">{t.sub}</p>
        <ul
          ref={gridRef}
          className={`story-grid${revealed ? ' is-in' : ''}`}
        >
          {t.points.map((point, i) => (
            <li
              key={point.keyword}
              className="story-card"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <strong className="story-point-key">{point.keyword}</strong>
              <span className="story-point-rest">{point.rest}</span>
            </li>
          ))}
        </ul>
        <div className="story-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/global_friend.png"
            alt={t.imgAlt}
            width={760}
            height={684}
          />
        </div>
      </div>
    </section>
  );
}
