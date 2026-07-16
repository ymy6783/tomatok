'use client';

import type { Locale } from '@/lib/locale';

const COPY = {
  ko: {
    eyebrow: 'Connection',
    line1: 'Imagine…',
    line2: 'Speaking to anyone',
    line3: 'Without learning another language.',
    chips: [
      '서울',
      'Hanoi',
      'Tokyo',
      'New York',
      'Berlin',
      'São Paulo',
      'Dubai',
      'Singapore',
    ],
  },
  en: {
    eyebrow: 'Connection',
    line1: 'Imagine…',
    line2: 'Speaking to anyone',
    line3: 'Without learning another language.',
    chips: [
      'Seoul',
      'Hanoi',
      'Tokyo',
      'New York',
      'Berlin',
      'São Paulo',
      'Dubai',
      'Singapore',
    ],
  },
} as const;

export default function ConnectionStory({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="story" id="story">
      <div className="story-inner wrap">
        <span className="eyebrow">{t.eyebrow}</span>
        <p className="story-imagine">{t.line1}</p>
        <h2 className="story-headline">
          {t.line2}
          <br />
          <span className="accent">{t.line3}</span>
        </h2>
      </div>
      <div className="story-rail" aria-hidden="true">
        <div className="story-rail-track">
          {[...t.chips, ...t.chips].map((c, i) => (
            <span key={`${c}-${i}`} className="story-chip">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
