'use client';

import type { Locale } from '@/lib/locale';

const ITEMS = [
  {
    id: 'video-xlate',
    ko: '화상 통화 실시간 번역',
    en: 'Live Video Translation',
    noteKo: '통화하면서 자동으로 번역되는 경험',
    noteEn: 'Auto-translate while you talk on video',
  },
  { id: 'ai', ko: 'AI Assistant+', en: 'AI Assistant+', noteKo: '더 깊은 대화 보조', noteEn: 'Deeper conversation help' },
  { id: 'avatar', ko: 'Avatar', en: 'Avatar', noteKo: 'Identity', noteEn: 'Identity' },
  {
    id: 'community',
    ko: 'Global Community',
    en: 'Global Community',
    noteKo: 'Scale',
    noteEn: 'Scale',
  },
  { id: 'market', ko: 'Marketplace', en: 'Marketplace', noteKo: 'Commerce', noteEn: 'Commerce' },
  {
    id: 'smart',
    ko: 'Smart Translation',
    en: 'Smart Translation',
    noteKo: 'Next gen',
    noteEn: 'Next gen',
  },
] as const;

export default function FutureTimeline({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="future" id="future">
      <div className="section-head wrap">
        <span className="eyebrow">Future</span>
        <h2>{en ? 'What’s next' : '다음으로'}</h2>
        <p>
          {en
            ? 'Next up: live translation during video calls—product first, no neon hype.'
            : '다음은 화상통화 중 실시간 자동 번역. 제품이 먼저, 과한 과장은 없습니다.'}
        </p>
      </div>
      <ol className="future-timeline wrap">
        {ITEMS.map((item, i) => (
          <li key={item.id} className="future-item">
            <span className="future-dot" aria-hidden="true" />
            <span className="future-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h4>{en ? item.en : item.ko}</h4>
              <p>{en ? item.noteEn : item.noteKo}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
