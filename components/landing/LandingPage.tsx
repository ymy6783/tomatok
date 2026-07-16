"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import "@/app/landing.css";
import { getLandingBodyHtml } from "@/components/landing/landingHtml";
import { landingEmptyNewsTitle } from "@/components/landing/landingCopy";
import ConnectionStory from "@/components/landing/ConnectionStory";
import FeatureExperience from "@/components/landing/FeatureExperience";
import FutureTimeline from "@/components/landing/FutureTimeline";
import HeroLanguageBubbles from "@/components/landing/HeroLanguageBubbles";
import LandingLocaleSync from "@/components/landing/LandingLocaleSync";
import ProductExperienceStack from "@/components/landing/ProductExperienceStack";
import UseCasesGrid from "@/components/landing/UseCasesGrid";
import WhatIsBento from "@/components/landing/WhatIsBento";
import WhyTomatok from "@/components/landing/WhyTomatok";
import LocaleTabs from "@/components/LocaleTabs";
import type { Locale } from "@/lib/locale";
import { withLocale } from "@/lib/locale";
import { categoryLabel } from "@/lib/noticeCategories";

export type LandingNewsItem = {
  id: string;
  title: string;
  date: string | null;
  category?: string | null;
};

const MARKERS = [
  "<!--PLAN_STORY-->",
  "<!--PLAN_BENTO-->",
  "<!--PLAN_EXPERIENCE-->",
  "<!--PLAN_WHY-->",
  "<!--PLAN_FEATURES-->",
  "<!--PLAN_USECASES-->",
  "<!--PLAN_FUTURE-->",
] as const;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function newsTag(category?: string | null) {
  if (category === "urgent") return { cls: "notice", label: "NOTICE" };
  if (category === "upgrade") return { cls: "update", label: "UPDATE" };
  if (category === "shareholder") return { cls: "event", label: "EVENT" };
  return { cls: "update", label: "UPDATE" };
}

function buildNewsGrid(news: LandingNewsItem[], locale: Locale) {
  const noticeHref = withLocale("/notice", locale);
  if (!news.length) {
    return `
      <a class="news-card" href="${escapeHtml(noticeHref)}" style="text-decoration:none;color:inherit">
        <div class="news-thumb" style="background:linear-gradient(135deg,#FDEBEC,#FFF3F3);display:flex;align-items:center;justify-content:center;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="#E53945" stroke-width="1.6" stroke-linejoin="round"/></svg>
        </div>
        <div class="news-body">
          <span class="news-tag notice">NOTICE</span>
          <h4>${escapeHtml(landingEmptyNewsTitle(locale))}</h4>
          <span>TOMATOK Notices</span>
        </div>
      </a>`;
  }
  return news
    .map((n) => {
      const tag = newsTag(n.category);
      const title = escapeHtml(n.title);
      const date = escapeHtml(n.date || "");
      const cat = escapeHtml(categoryLabel(n.category, locale));
      const href = withLocale(`/notice/${n.id}`, locale);
      return `
      <a class="news-card" href="${escapeHtml(href)}" style="text-decoration:none;color:inherit">
        <div class="news-thumb" style="background:linear-gradient(135deg,#F7F7F9,#FFFFFF);display:flex;align-items:center;justify-content:center;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="#E53945" stroke-width="1.6" stroke-linejoin="round"/></svg>
        </div>
        <div class="news-body">
          <span class="news-tag ${tag.cls}">${tag.label}</span>
          <h4>${title}</h4>
          <span>${date}${cat ? ` · ${cat}` : ""}</span>
        </div>
      </a>`;
    })
    .join("\n");
}

function splitByMarkers(html: string) {
  const parts: string[] = [];
  let cursor = 0;
  for (const marker of MARKERS) {
    const idx = html.indexOf(marker, cursor);
    if (idx < 0) {
      parts.push(html.slice(cursor));
      return { parts, ok: false as const };
    }
    parts.push(html.slice(cursor, idx));
    cursor = idx + marker.length;
  }
  parts.push(html.slice(cursor));
  return { parts, ok: true as const };
}

export default function LandingPage({
  news,
  locale,
}: {
  news: LandingNewsItem[];
  locale: Locale;
}) {
  const html = useMemo(() => {
    return getLandingBodyHtml(locale).replace(
      "<!--NEWS_GRID-->",
      buildNewsGrid(news, locale)
    );
  }, [news, locale]);

  const chunks = useMemo(() => {
    const { parts, ok } = splitByMarkers(html);
    if (!ok || parts.length !== MARKERS.length + 1) {
      return null;
    }
    return {
      beforeStory: parts[0],
      betweenStoryBento: parts[1],
      betweenBentoExp: parts[2],
      betweenExpWhy: parts[3],
      betweenWhyFeatures: parts[4],
      betweenFeaturesUse: parts[5],
      betweenUseFuture: parts[6],
      afterFuture: parts[7],
    };
  }, [html]);

  const [showFloatDownload, setShowFloatDownload] = useState(false);

  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("scrolled", y > 20);
      const hero = document.querySelector(".hero") as HTMLElement | null;
      const download = document.getElementById("download");
      const pastHero = hero ? y > hero.offsetHeight * 0.55 : y > 420;
      const nearDownload = download
        ? download.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setShowFloatDownload(pastHero && !nearDownload && window.innerWidth <= 768);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    const burgerBtn = document.getElementById("burgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const onBurger = () => {
      burgerBtn?.classList.toggle("open");
      mobileMenu?.classList.toggle("open");
    };
    burgerBtn?.addEventListener("click", onBurger);
    const mobileLinks = mobileMenu?.querySelectorAll("a") || [];
    const closeMobile = () => {
      burgerBtn?.classList.remove("open");
      mobileMenu?.classList.remove("open");
    };
    mobileLinks.forEach((a) => a.addEventListener("click", closeMobile));

    const onFaqClick = (e: Event) => {
      const q = (e.target as HTMLElement).closest(".faq-q");
      if (!q) return;
      const item = q.parentElement;
      if (!item) return;
      document.querySelectorAll(".faq-item").forEach((i) => {
        if (i !== item) i.classList.remove("open");
      });
      item.classList.toggle("open");
    };
    document.querySelector(".faq-list")?.addEventListener("click", onFaqClick);

    document.querySelectorAll("[onclick]").forEach((el) => {
      el.removeAttribute("onclick");
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      burgerBtn?.removeEventListener("click", onBurger);
      mobileLinks.forEach((a) => a.removeEventListener("click", closeMobile));
      document
        .querySelector(".faq-list")
        ?.removeEventListener("click", onFaqClick);
    };
  }, [html]);

  return (
    <>
      <Suspense fallback={null}>
        <LandingLocaleSync />
      </Suspense>
      <div className="landing-root" lang={locale}>
        <div className="landing-hero-fx" aria-hidden="true">
          <HeroLanguageBubbles />
        </div>
        {chunks ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: chunks.beforeStory }} />
            <ConnectionStory locale={locale} />
            {chunks.betweenStoryBento ? (
              <div
                dangerouslySetInnerHTML={{ __html: chunks.betweenStoryBento }}
              />
            ) : null}
            <WhatIsBento locale={locale} />
            {chunks.betweenBentoExp ? (
              <div
                dangerouslySetInnerHTML={{ __html: chunks.betweenBentoExp }}
              />
            ) : null}
            <ProductExperienceStack locale={locale} />
            {chunks.betweenExpWhy ? (
              <div
                dangerouslySetInnerHTML={{ __html: chunks.betweenExpWhy }}
              />
            ) : null}
            <WhyTomatok locale={locale} />
            {chunks.betweenWhyFeatures ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: chunks.betweenWhyFeatures,
                }}
              />
            ) : null}
            <FeatureExperience locale={locale} />
            {chunks.betweenFeaturesUse ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: chunks.betweenFeaturesUse,
                }}
              />
            ) : null}
            <UseCasesGrid locale={locale} />
            {chunks.betweenUseFuture ? (
              <div
                dangerouslySetInnerHTML={{ __html: chunks.betweenUseFuture }}
              />
            ) : null}
            <FutureTimeline locale={locale} />
            <div dangerouslySetInnerHTML={{ __html: chunks.afterFuture }} />
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
      <div className="landing-locale-dock" aria-label="Language">
        <LocaleTabs locale={locale} variant="compact" />
      </div>
      <a
        className={`landing-float-download${showFloatDownload ? " is-visible" : ""}`}
        href="#download"
      >
        {locale === "en" ? "Download App" : "앱 다운로드"}
      </a>
    </>
  );
}
