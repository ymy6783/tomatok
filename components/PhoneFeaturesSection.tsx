"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/locale";

type Feature = {
  image: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
};

const FEATURES: Feature[] = [
  {
    image: "/features/phone-01.svg",
    title: {
      ko: "실시간 공지사항",
      en: "Live notices",
    },
    description: {
      ko: "토마톡의 최신 소식과 업데이트를 앱에서 바로 확인하세요. 카테고리별로 정리된 공지가 한눈에 보입니다.",
      en: "Check the latest TomaTok updates in the app. Notices are organized by category so you can find what matters fast.",
    },
  },
  {
    image: "/features/phone-02.svg",
    title: {
      ko: "안전한 지갑 연결",
      en: "Secure wallet link",
    },
    description: {
      ko: "지갑을 연결하고 자산을 안전하게 관리하세요. 간편한 인증 흐름으로 바로 시작할 수 있습니다.",
      en: "Connect your wallet and manage assets securely. A simple auth flow gets you started in moments.",
    },
  },
  {
    image: "/features/phone-03.svg",
    title: {
      ko: "TOTT 스테이킹",
      en: "TOTT staking",
    },
    description: {
      ko: "스마트컨트랙트 기반 스테이킹으로 보상을 확인하세요. 투명한 풀 정보와 예상 수익률을 제공합니다.",
      en: "Stake with smart contracts and track rewards. Pool details and estimated APR are always in view.",
    },
  },
  {
    image: "/features/phone-04.svg",
    title: {
      ko: "화이트페이퍼 & 생태계",
      en: "White paper & ecosystem",
    },
    description: {
      ko: "비전, 로드맵, 생태계 구성을 한곳에서 살펴보세요. TOTT 생태계의 방향을 쉽게 이해할 수 있습니다.",
      en: "Explore the vision, roadmap, and ecosystem in one place. Understand where the TOTT network is headed.",
    },
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function PhoneFeaturesSection({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const mockupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let observer: IntersectionObserver | null = null;

    function setup() {
      observer?.disconnect();
      observer = null;
      if (!mq.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          const hit = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!hit) return;
          const index = Number(
            (hit.target as HTMLElement).dataset.index ?? "0"
          );
          if (!Number.isNaN(index)) setActive(index);
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      mockupRefs.current.forEach((el) => {
        if (el) observer?.observe(el);
      });
    }

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      observer?.disconnect();
    };
  }, []);

  const current = FEATURES[active] ?? FEATURES[0];
  const total = FEATURES.length;

  return (
    <section className="bg-[var(--background)]" aria-labelledby="phone-features-heading">
      <div className="mx-auto w-full max-w-[980px] px-5 py-24 md:py-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Features
        </p>
        <h2
          id="phone-features-heading"
          className="mt-2 text-[32px] font-semibold tracking-[-0.025em] text-[var(--foreground)] md:text-[40px]"
        >
          {locale === "en" ? "Built for every moment" : "다양한 기능으로 완성되는 경험"}
        </h2>

        {/* Desktop: sticky text + stacked mockups */}
        <div className="mt-14 hidden md:grid md:grid-cols-2 md:gap-16 lg:gap-20">
          <div className="relative">
            <div className="sticky top-[28vh]">
              <p className="text-[13px] font-medium tabular-nums tracking-[0.04em] text-[var(--muted)]">
                {pad(active + 1)}
                <span className="mx-2 opacity-50">—</span>
                {pad(total)}
              </p>
              <div
                key={active}
                className="feature-fade-up mt-5"
              >
                <h3 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--foreground)] lg:text-[40px]">
                  {current.title[locale]}
                </h3>
                <p className="mt-4 max-w-[360px] text-[17px] leading-[1.47] text-[var(--muted)] lg:text-[19px]">
                  {current.description[locale]}
                </p>
              </div>
              <div className="mt-8 flex gap-2" aria-hidden>
                {FEATURES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 bg-[var(--foreground)]"
                        : "w-1.5 bg-[var(--band-deep)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-24 lg:gap-32">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.image}
                data-index={i}
                ref={(el) => {
                  mockupRefs.current[i] = el;
                }}
                className={`flex justify-center transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-45"
                }`}
              >
                <PhoneFrame
                  src={feature.image}
                  alt={feature.title[locale]}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: sequential text + mockup pairs */}
        <div className="mt-12 flex flex-col gap-16 md:hidden">
          {FEATURES.map((feature, i) => (
            <div key={feature.image} className="flex flex-col gap-6">
              <div>
                <p className="text-[13px] font-medium tabular-nums tracking-[0.04em] text-[var(--muted)]">
                  {pad(i + 1)}
                  <span className="mx-2 opacity-50">—</span>
                  {pad(total)}
                </p>
                <h3 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.022em] text-[var(--foreground)]">
                  {feature.title[locale]}
                </h3>
                <p className="mt-3 text-[17px] leading-[1.47] text-[var(--muted)]">
                  {feature.description[locale]}
                </p>
              </div>
              <div className="flex justify-center">
                <PhoneFrame
                  src={feature.image}
                  alt={feature.title[locale]}
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative w-[min(100%,280px)] overflow-hidden rounded-[40px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10">
      <Image
        src={src}
        alt={alt}
        width={390}
        height={844}
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  );
}
