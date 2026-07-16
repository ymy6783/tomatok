'use client';

import type { Locale } from '@/lib/locale';

const ITEMS = [
  { id: 'translate', ko: '자동 번역', en: 'Automatic Translation', subKo: '120+ Languages', subEn: '120+ Languages', wide: true },
  { id: 'ai', ko: 'AI 대화', en: 'AI Conversation', subKo: '요약 · 추천 답장', subEn: 'Summaries & smart replies', wide: false },
  { id: 'voice', ko: '음성 번역', en: 'Voice Translation', subKo: '말할 때도 통역', subEn: 'Live voice interpreting', wide: false },
  {
    id: 'video',
    ko: '화상 통화',
    en: 'Video Call',
    subKo: '통화 중 실시간 자동 번역',
    subEn: 'Live auto-translate on video calls',
    wide: false,
  },
  { id: 'wallet', ko: 'Wallet', en: 'Wallet', subKo: '포인트 · TOTT', subEn: 'Points & TOTT', wide: false },
  { id: 'reward', ko: 'Reward', en: 'Reward', subKo: '출석 · 초대 · 미션', subEn: 'Check-in · invite · missions', wide: false },
  { id: 'community', ko: 'Community', en: 'Community', subKo: '글로벌 오픈채팅', subEn: 'Global open chats', wide: false },
  { id: 'nft', ko: 'NFT', en: 'NFT', subKo: '디지털 자산', subEn: 'Digital assets', wide: false },
] as const;

export default function WhatIsBento({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="bento" id="product">
      <div className="section-head wrap">
        <span className="eyebrow">What is TOMATOK</span>
        <h2>
          One App.
          <br />
          Unlimited Conversations.
        </h2>
        <p>
          {en
            ? 'Translation, chat, voice, video, wallet, rewards, and community—linked in one experience.'
            : '번역, 채팅, 음성, 화상, 지갑, 리워드, 커뮤니티를 하나의 경험으로 연결합니다.'}
        </p>
      </div>
      <div className="bento-grid wrap">
        {ITEMS.map((item) => (
          <article
            key={item.id}
            className={`bento-card bento-card--${item.id}${item.wide ? ' is-wide' : ''}`}
          >
            <h3>{en ? item.en : item.ko}</h3>
            <p>{en ? item.subEn : item.subKo}</p>
          </article>
        ))}
        <article className="bento-card bento-card--hero is-wide">
          <h3>
            One App.
            <br />
            Unlimited Conversations.
          </h3>
          <p>
            {en
              ? 'Not a feature list—a connected product you feel in seconds.'
              : '기능 나열이 아니라, 몇 초 만에 느껴지는 연결된 제품입니다.'}
          </p>
        </article>
      </div>
    </section>
  );
}
