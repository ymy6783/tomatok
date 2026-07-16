'use client';

import type { Locale } from '@/lib/locale';

const CASES = [
  { id: 'business', tag: 'Business', ko: '비즈니스', en: 'Business', descKo: '해외 파트너와 오해 없이, 빠르게.', descEn: 'Clear, fast talks with global partners.' },
  { id: 'travel', tag: 'Travel', ko: '여행', en: 'Travel', descKo: '낯선 곳에서도 바로 대화.', descEn: 'Speak freely wherever you go.' },
  { id: 'education', tag: 'Education', ko: '교육', en: 'Education', descKo: '언어가 다른 학습도 이어지게.', descEn: 'Keep learning across languages.' },
  { id: 'healthcare', tag: 'Healthcare', ko: '헬스케어', en: 'Healthcare', descKo: '의료 상담도 정확히 전달.', descEn: 'Care conversations that stay accurate.' },
  { id: 'family', tag: 'Family', ko: '가족', en: 'Family', descKo: '세대를 넘는 일상 대화.', descEn: 'Everyday talk across generations.' },
  { id: 'community', tag: 'Global Community', ko: '글로벌 커뮤니티', en: 'Global Community', descKo: '세계와 한 방에서 연결.', descEn: 'One room with the world.' },
] as const;

export default function UseCasesGrid({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="usecases usecases--plan" id="usecases">
      <div className="section-head wrap">
        <span className="eyebrow">Use Cases</span>
        <h2>{en ? 'Where you use it.' : '어디서든, 누구와도.'}</h2>
        <p>
          {en
            ? 'Business, travel, education, healthcare, family, community—one product.'
            : '비즈니스, 여행, 교육, 헬스케어, 가족, 커뮤니티—하나의 제품.'}
        </p>
      </div>
      <div className="uc-grid uc-grid--six wrap">
        {CASES.map((c) => (
          <article key={c.id} className={`uc-card uc-card--glass uc-card--${c.id}`}>
            <div className="uc-body">
              <div className="uc-tag">{c.tag}</div>
              <h3>{en ? c.en : c.ko}</h3>
              <p>{en ? c.descEn : c.descKo}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
