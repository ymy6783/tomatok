'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/locale';

type Glow = 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'indigo';

type JourneyStep = {
  glow: Glow;
  image: string;
  alt: { ko: string; en: string };
  journey: string;
  headline: { ko: string; en: string };
  desc: { ko: string; en: string };
  features: { ko: string[]; en: string[] };
};

const STEPS: JourneyStep[] = [
  {
    glow: 'blue',
    image: '/landing/mockups/journey-01.png',
    alt: {
      ko: '한국어 ↔ 영어 채팅 번역 화면',
      en: 'Korean ↔ English chat translation',
    },
    journey: 'Chat',
    headline: {
      ko: '언어가 달라도 자유롭게 소통하세요.',
      en: 'Talk freely—even when languages differ.',
    },
    desc: {
      ko: '토마톡은 AI 실시간 번역을 통해 서로 다른 언어를 사용하는 사람들과도 자연스럽게 대화할 수 있습니다. 한국어로 보낸 메시지는 상대방의 언어로 번역되어 전달되고, 받은 메시지는 다시 내 언어로 표시되어 언어의 장벽 없이 소통할 수 있습니다.',
      en: 'TomaTok’s real-time AI translation lets you chat naturally with people who speak other languages. Messages you send in Korean are delivered in their language, and messages you receive appear in yours—so conversation flows without a language barrier.',
    },
    features: {
      ko: [
        '120개국 이상 언어 지원',
        'AI 실시간 번역',
        '원문과 번역문 동시 제공',
        '개인 채팅 및 그룹 채팅 지원',
      ],
      en: [
        '120+ languages',
        'Real-time AI translation',
        'Original and translation together',
        '1:1 and group chat',
      ],
    },
  },
  {
    glow: 'purple',
    image: '/landing/mockups/journey-02.png',
    alt: { ko: 'AI Assistant 채팅 화면', en: 'AI Assistant chat' },
    journey: 'AI',
    headline: {
      ko: '대화를 넘어 AI와 함께하는 메신저.',
      en: 'A messenger that goes beyond chat—with AI.',
    },
    desc: {
      ko: '궁금한 내용을 질문하거나, 문장을 자연스럽게 수정하고 번역을 요청하는 등 다양한 작업을 AI Assistant와 함께할 수 있습니다. 메신저 안에서 필요한 정보를 빠르게 얻고 생산성을 높일 수 있습니다.',
      en: 'Ask questions, polish sentences, or request translations with AI Assistant. Get what you need inside the messenger and stay productive.',
    },
    features: {
      ko: ['AI 챗봇', '번역 및 문장 수정', '질문 및 정보 검색', '글쓰기 보조'],
      en: [
        'AI chatbot',
        'Translation & rewriting',
        'Q&A and search',
        'Writing assistance',
      ],
    },
  },
  {
    glow: 'green',
    image: '/landing/mockups/journey-03.png',
    alt: { ko: '글로벌 그룹 채팅 화면', en: 'Global group chat' },
    journey: 'Community',
    headline: {
      ko: '전 세계 사람들과 하나의 채팅방에서 소통하세요.',
      en: 'Connect with the world in one chat room.',
    },
    desc: {
      ko: '국적이나 언어에 상관없이 다양한 사람들과 그룹 채팅을 즐길 수 있습니다. 모든 참여자는 자신의 언어로 메시지를 읽고 작성할 수 있어 글로벌 커뮤니티에서도 자연스러운 대화가 가능합니다.',
      en: 'Join group chats with people of any nationality or language. Everyone reads and writes in their own language, so global communities feel natural.',
    },
    features: {
      ko: [
        '글로벌 그룹 채팅',
        '실시간 다국어 번역',
        '관심사 기반 커뮤니티',
        '자유로운 국제 소통',
      ],
      en: [
        'Global group chat',
        'Real-time multilingual translation',
        'Interest-based communities',
        'Borderless conversation',
      ],
    },
  },
  {
    glow: 'amber',
    image: '/landing/mockups/journey-04.png',
    alt: { ko: '출석 및 미니게임 화면', en: 'Attendance and mini games' },
    journey: 'Play',
    headline: {
      ko: '매일 즐기고 포인트를 모으세요.',
      en: 'Play every day and earn points.',
    },
    desc: {
      ko: '토마톡은 단순한 메신저가 아닙니다. 출석 체크, 오늘의 미션, 미니게임, 다양한 이벤트를 통해 포인트를 획득하며 매일 새로운 즐거움을 경험할 수 있습니다. 획득한 포인트는 꾸준히 모아 다양한 혜택으로 이어질 수 있습니다.',
      en: 'TomaTok is more than a messenger. Check in, complete daily missions, play mini games, and join events to earn points every day. Keep collecting points and unlock more rewards over time.',
    },
    features: {
      ko: ['출석 체크', '오늘의 미션', '미니게임', '이벤트 참여', '포인트 적립'],
      en: [
        'Attendance check',
        'Daily missions',
        'Mini games',
        'Events',
        'Earn points',
      ],
    },
  },
  {
    glow: 'red',
    image: '/landing/mockups/journey-05.png',
    alt: {
      ko: '포인트 TOTT 교환 및 친구 초대 화면',
      en: 'Point to TOTT and invite rewards',
    },
    journey: 'Reward',
    headline: {
      ko: '활동이 실제 보상으로 이어집니다.',
      en: 'Your activity turns into real rewards.',
    },
    desc: {
      ko: '게임과 미션을 통해 모은 포인트는 일정 조건을 충족하면 TOTT로 교환할 수 있습니다. 또한 친구를 초대하면 추천 보상으로 TOTT를 받을 수 있어 서비스 활동이 더욱 가치 있는 경험으로 이어집니다.',
      en: 'Points from games and missions can be exchanged for TOTT when conditions are met. Invite friends to earn referral rewards in TOTT—so your activity turns into real value.',
    },
    features: {
      ko: [
        'Point → TOTT 교환',
        '친구 초대 리워드',
        '추천인 보상',
        'TOTT 적립 현황 확인',
      ],
      en: [
        'Point → TOTT exchange',
        'Invite rewards',
        'Referral bonuses',
        'Track TOTT earnings',
      ],
    },
  },
  {
    glow: 'indigo',
    image: '/landing/mockups/journey-06.png',
    alt: { ko: 'Phantom Wallet 연동 화면', en: 'Phantom Wallet connection' },
    journey: 'Wallet',
    headline: {
      ko: '디지털 자산을 쉽고 안전하게 관리하세요.',
      en: 'Manage digital assets simply and securely.',
    },
    desc: {
      ko: '토마톡은 Phantom Wallet 연동을 지원하여 보유한 TOTT를 편리하게 확인하고 관리할 수 있습니다. 메신저와 디지털 자산을 하나의 경험으로 연결하여 더욱 확장된 서비스를 제공합니다.',
      en: 'TomaTok supports Phantom Wallet so you can check and manage your TOTT with ease. Messaging and digital assets come together in one expanded experience.',
    },
    features: {
      ko: [
        'Phantom Wallet 연결',
        'TOTT 보유 자산 확인',
        '간편한 Wallet 연동',
        'Web3 서비스 확장',
      ],
      en: [
        'Connect Phantom Wallet',
        'View your TOTT',
        'Easy wallet link',
        'Expand into Web3',
      ],
    },
  },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function ProductExperienceStack({
  locale,
}: {
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const n = STEPS.length;
  const activeFloat = progress * (n - 1);
  const activeIndex = clamp(Math.round(activeFloat), 0, n - 1);
  const step = STEPS[activeIndex] ?? STEPS[0];

  const head = useMemo(
    () =>
      locale === 'en'
        ? {
            title: 'This is how it feels.',
            sub: 'From Chat to Wallet—one scene at a time.',
          }
        : {
            title: '실제로 이렇게 씁니다',
            sub: 'Chat부터 Wallet까지, 한 장면씩 경험하세요.',
          },
    [locale]
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const p = clamp(-rect.top / total, 0, 1);
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="experience" id="features" ref={sectionRef}>
      <div className="section-head wrap exp-section-head">
        <span className="eyebrow">Product Experience</span>
        <h2>{head.title}</h2>
        <p>{head.sub}</p>
      </div>

      {/* Desktop sticky stack */}
      <div
        ref={pinRef}
        className="exp-pin"
        style={{ height: `${Math.max(n, 1) * 100}vh` }}
      >
        <div className="exp-pin-inner">
          <div className="exp-copy">
            <div
              key={activeIndex}
              className={`exp-copy-swap${reducedMotion ? '' : ' is-anim'}`}
            >
              <div className="exp-num">
                {pad(activeIndex + 1)} / {pad(n)}
              </div>
              <p className="exp-journey">{step.journey}</p>
              <h3>{step.headline[locale]}</h3>
              <p>{step.desc[locale]}</p>
              <ul className="exp-features">
                {step.features[locale].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="exp-dots" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span
                  key={STEPS[i].journey}
                  className={i === activeIndex ? 'active' : undefined}
                />
              ))}
            </div>
          </div>

          <div className="exp-stack">
            {STEPS.map((s, i) => {
              const offset = i - activeFloat;
              // Incoming cards sit below; passed cards stack slightly behind
              let y: number;
              let scale: number;
              let opacity: number;
              if (offset > 0) {
                y = Math.min(offset, 1.2) * 108;
                scale = 1;
                opacity = offset > 1.05 ? 0 : 1;
              } else {
                y = offset * 10;
                scale = 1 + offset * 0.035;
                opacity = offset < -2.2 ? 0 : 1;
              }
              return (
                <div
                  key={s.image}
                  className={`exp-card exp-card--${s.glow}${
                    i === activeIndex ? ' is-active' : ''
                  }`}
                  style={{
                    zIndex: 10 + i,
                    transform: `translate3d(-50%, calc(-50% + ${y}%), 0) scale(${scale})`,
                    opacity,
                  }}
                >
                  <span className="exp-glow" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="exp-mockup-img"
                    src={s.image}
                    alt={s.alt[locale]}
                    width={320}
                    height={650}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: vertical list with captions */}
      <div className="exp-mobile">
        {STEPS.map((s, i) => (
          <article key={s.image} className="exp-mobile-item">
            <div className="exp-mobile-copy">
              <div className="exp-num">
                {pad(i + 1)} / {pad(n)}
              </div>
              <p className="exp-journey">{s.journey}</p>
              <h3>{s.headline[locale]}</h3>
              <p>{s.desc[locale]}</p>
              <ul className="exp-features">
                {s.features[locale].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className={`exp-mockup-wrap exp-card--${s.glow}`}>
              <span className="exp-glow" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="exp-mockup-img"
                src={s.image}
                alt={s.alt[locale]}
                width={280}
                height={570}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
