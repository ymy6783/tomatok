"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locale";

/**
 * Left = Korean grandson’s view
 * Right = Vietnamese grandma’s view
 * Bubble PNGs from public/landing/xlate — steps 1–4 in sync.
 */
const LEFT = [
  "/landing/xlate/left-1.png",
  "/landing/xlate/left-2.png",
  "/landing/xlate/left-3.png",
  "/landing/xlate/left-4.png",
] as const;

const RIGHT = [
  "/landing/xlate/right-1.png",
  "/landing/xlate/right-2.png",
  "/landing/xlate/right-3.png",
  "/landing/xlate/right-4.png",
] as const;

const LABELS = {
  ko: {
    leftTitle: "한국 손자",
    leftSub: "손자가 보는 화면",
    rightTitle: "베트남 할머니",
    rightSub: "할머니가 보는 화면",
  },
  en: {
    leftTitle: "Korean grandson",
    leftSub: "What he sees",
    rightTitle: "Vietnamese grandma",
    rightSub: "What she sees",
  },
} as const;

const STEPS = 4;
const STEP_MS = 1100;
const HOLD_MS = 2600;
const RESET_MS = 700;

export default function TranslationDemo({ locale }: { locale: Locale }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const labels = LABELS[locale];

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = (step: number) => {
      if (cancelled) return;
      if (step <= STEPS) {
        setVisibleSteps(step);
        timer = setTimeout(() => run(step + 1), STEP_MS);
      } else {
        timer = setTimeout(() => {
          if (cancelled) return;
          setVisibleSteps(0);
          timer = setTimeout(() => run(1), RESET_MS);
        }, HOLD_MS);
      }
    };

    setVisibleSteps(0);
    timer = setTimeout(() => run(1), 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [locale]);

  return (
    <div className="xlate-demo">
      <div className="xlate-cols">
        <BubbleColumn
          title={labels.leftTitle}
          sub={labels.leftSub}
          badge="KR"
          srcs={LEFT}
          visibleSteps={visibleSteps}
        />
        <div className="xlate-bridge" aria-hidden>
          <span className="xlate-bridge-icon">⇄</span>
        </div>
        <BubbleColumn
          title={labels.rightTitle}
          sub={labels.rightSub}
          badge="VI"
          srcs={RIGHT}
          visibleSteps={visibleSteps}
        />
      </div>
    </div>
  );
}

function BubbleColumn({
  title,
  sub,
  badge,
  srcs,
  visibleSteps,
}: {
  title: string;
  sub: string;
  badge: string;
  srcs: readonly string[];
  visibleSteps: number;
}) {
  return (
    <div className="xlate-col">
      <div className="xlate-label">
        <span className="xlate-badge">{badge}</span>
        <div>
          <b>{title}</b>
          <span>{sub}</span>
        </div>
      </div>
      <div className="xlate-bubbles">
        {srcs.map((src, i) => {
          const step = i + 1;
          return (
            <div
              key={src}
              className={`xlate-msg ${step <= visibleSteps ? "is-on" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" width={640} height={200} decoding="async" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
