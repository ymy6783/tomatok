'use client';

import type { Locale } from '@/lib/locale';

const ITEMS = [
  { id: 'nft', ko: 'NFT', en: 'NFT', note: 'Membership' },
  { id: 'ai', ko: 'AI', en: 'AI', note: 'Assistant+' },
  { id: 'avatar', ko: 'Avatar', en: 'Avatar', note: 'Identity' },
  { id: 'community', ko: 'Global Community', en: 'Global Community', note: 'Scale' },
  { id: 'market', ko: 'Marketplace', en: 'Marketplace', note: 'Commerce' },
  { id: 'smart', ko: 'Smart Translation', en: 'Smart Translation', note: 'Next gen' },
] as const;

export default function FutureTimeline({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="future" id="future">
      <div className="section-head wrap">
        <span className="eyebrow">Future</span>
        <h2>Coming Soon</h2>
        <p>
          {en
            ? 'The next chapter of TOMATOK—still product-first, never neon hype.'
            : '토마톡의 다음 이야기. 제품이 먼저, 과한 과장은 없습니다.'}
        </p>
      </div>
      <ol className="future-timeline wrap">
        {ITEMS.map((item, i) => (
          <li key={item.id} className="future-item">
            <span className="future-dot" aria-hidden="true" />
            <span className="future-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h4>{en ? item.en : item.ko}</h4>
              <p>{item.note}</p>
            </div>
            <span className="badge-soon">Coming soon</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
