'use client';

import type { Locale } from '@/lib/locale';

const STEPS = [
  { id: 'language', ko: 'Language', en: 'Language', descKo: '언어가 달라 대화가 멈춘다', descEn: 'Different languages stop the talk', solution: false },
  { id: 'distance', ko: 'Distance', en: 'Distance', descKo: '거리와 시차가 관계를 끊는다', descEn: 'Distance and time zones pull people apart', solution: false },
  { id: 'complex', ko: 'Complex', en: 'Complex Communication', descKo: '도구가 흩어져 소통이 복잡하다', descEn: 'Tools scatter—communication gets hard', solution: false },
  { id: 'culture', ko: 'Culture', en: 'Different Culture', descKo: '문화 차이가 오해를 만든다', descEn: 'Culture gaps create misunderstanding', solution: false },
  { id: 'solution', ko: 'TOMATOK', en: 'TOMATOK', descKo: '하나의 해결', descEn: 'One solution', solution: true },
] as const;

export default function WhyTomatok({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="why" id="why">
      <div className="section-head wrap">
        <span className="eyebrow">Why TOMATOK</span>
        <h2>{en ? 'From barriers to one connection.' : '장벽에서, 하나의 연결로.'}</h2>
        <p>
          {en
            ? 'Language, distance, complexity, culture—solved in one product experience.'
            : '언어, 거리, 복잡함, 문화—하나의 제품 경험으로 풉니다.'}
        </p>
      </div>
      <ol className="why-flow wrap">
        {STEPS.map((s, i) => (
          <li key={s.id} className={`why-step${s.solution ? ' is-solution' : ''}`}>
            <span className="why-index">{String(i + 1).padStart(2, '0')}</span>
            <strong>{en ? s.en : s.ko}</strong>
            <span>{en ? s.descEn : s.descKo}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
