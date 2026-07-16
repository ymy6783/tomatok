'use client';

import type { Locale } from '@/lib/locale';

const FEATURES = [
  { id: 'realtime', ko: 'Real-time Translation', en: 'Real-time Translation', descKo: '120+ 언어, 보내자마자 내 언어로.', descEn: '120+ languages—arrives in yours.' },
  { id: 'voice', ko: 'Voice Call', en: 'Voice Call', descKo: '말할 때도 자연스럽게 이어지는 통역.', descEn: 'Calls that stay clear across languages.' },
  { id: 'video', ko: 'Video Meeting', en: 'Video Meeting', descKo: '얼굴을 보며 오해 없이.', descEn: 'Face-to-face without the barrier.' },
  { id: 'wallet', ko: 'Wallet', en: 'Wallet', descKo: '포인트와 TOTT를 한곳에서.', descEn: 'Points and TOTT in one place.' },
  { id: 'ai', ko: 'AI', en: 'AI', descKo: '요약, 추천, 글쓰기 보조.', descEn: 'Summaries, replies, writing help.' },
  { id: 'reward', ko: 'Reward', en: 'Reward', descKo: '출석·초대·미션으로 쌓이는 보상.', descEn: 'Earn through check-ins, invites, missions.' },
  { id: 'secure', ko: 'Secure', en: 'Secure', descKo: '암호화와 이상 거래 감지.', descEn: 'Encryption and anomaly detection.' },
] as const;

export default function FeatureExperience({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="fxcards" id="feature-experience">
      <div className="section-head wrap">
        <span className="eyebrow">Feature Experience</span>
        <h2>{en ? 'What feels different.' : '다르게 느껴지는 이유.'}</h2>
        <p>
          {en
            ? 'Hover each card—motion that confirms the product, not decoration.'
            : '카드에 마우스를 올려보세요. 장식이 아니라 제품을 확인하는 움직임입니다.'}
        </p>
      </div>
      <div className="fxcards-grid wrap">
        {FEATURES.map((f) => (
          <article key={f.id} className={`fxcard fxcard--${f.id}`}>
            <h3>{en ? f.en : f.ko}</h3>
            <p>{en ? f.descEn : f.descKo}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
