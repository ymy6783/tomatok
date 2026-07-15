"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "@/app/landing.css";
import { getLandingBodyHtml } from "@/components/landing/landingHtml";
import { landingEmptyNewsTitle } from "@/components/landing/landingCopy";
import LandingLocaleSync from "@/components/landing/LandingLocaleSync";
import TranslationDemo from "@/components/landing/TranslationDemo";
import LocaleTabs from "@/components/LocaleTabs";
import type { Locale } from "@/lib/locale";
import { withLocale } from "@/lib/locale";
import { categoryLabel } from "@/lib/noticeCategories";

const HeroParticleNetwork = dynamic(
  () => import("@/components/HeroParticleNetwork"),
  { ssr: false }
);

export type LandingNewsItem = {
  id: string;
  title: string;
  date: string | null;
  category?: string | null;
};

const TRANSLATION_MARKER = "<!--TRANSLATION_SECTION-->";

function renderExpFeatures(raw?: string) {
  if (!raw) return "";
  return raw
    .split("|")
    .map((f) => `<li>${escapeHtml(f.trim())}</li>`)
    .join("");
}

function buildExpCaption(el: HTMLElement) {
  const features = renderExpFeatures(el.dataset.features);
  return `
    <div class="exp-num">${escapeHtml(el.dataset.num || "")}</div>
    <p class="exp-journey">${escapeHtml(el.dataset.journey || "")}</p>
    <h3>${escapeHtml(el.dataset.headline || "")}</h3>
    <p>${escapeHtml(el.dataset.desc || "")}</p>
    ${features ? `<ul class="exp-features">${features}</ul>` : ""}`;
}

function applyExpPanel(el: HTMLElement) {
  const journeyEl = document.getElementById("expJourney");
  const headlineEl = document.getElementById("expHeadline");
  const descEl = document.getElementById("expDesc");
  const numEl = document.getElementById("expNum");
  const featuresEl = document.getElementById("expFeatures");

  if (numEl) numEl.textContent = el.dataset.num || "";
  if (journeyEl) journeyEl.textContent = el.dataset.journey || "";
  if (headlineEl) headlineEl.textContent = el.dataset.headline || "";
  if (descEl) descEl.textContent = el.dataset.desc || "";
  if (featuresEl) {
    featuresEl.innerHTML = renderExpFeatures(el.dataset.features);
  }
}

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

  const { beforeXlate, afterXlate } = useMemo(() => {
    const idx = html.indexOf(TRANSLATION_MARKER);
    if (idx < 0) {
      return { beforeXlate: html, afterXlate: "" };
    }
    return {
      beforeXlate: html.slice(0, idx),
      afterXlate: html.slice(idx + TRANSLATION_MARKER.length),
    };
  }, [html]);

  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null);
  const [localeEl, setLocaleEl] = useState<HTMLElement | null>(null);
  const [localeMobileEl, setLocaleMobileEl] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // Defer so DSIH nodes exist; re-query after locale/html swaps
    const id = requestAnimationFrame(() => {
      setHeroEl(document.querySelector<HTMLElement>(".landing-root .hero"));
      setLocaleEl(document.getElementById("landingLocaleMount"));
      setLocaleMobileEl(document.getElementById("landingLocaleMobileMount"));
    });
    return () => cancelAnimationFrame(id);
  }, [html]);

  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const onScroll = () => {
      header?.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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

    document.querySelectorAll(".exp-item").forEach((item) => {
      if ((item as HTMLElement).dataset.hasCaption === "true") return;
      const el = item as HTMLElement;
      if (!el.dataset.headline) return;
      const cap = document.createElement("div");
      cap.className = "exp-item-caption";
      cap.innerHTML = buildExpCaption(el);
      el.insertBefore(cap, el.firstChild);
      el.dataset.hasCaption = "true";
    });

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

    const sliderNav = document.querySelector(".slider-nav");
    const track = document.getElementById("previewTrack");
    const onSlider = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(".slider-btn");
      if (!btn || !sliderNav || !track) return;
      const buttons = [...sliderNav.querySelectorAll(".slider-btn")];
      const idx = buttons.indexOf(btn as Element);
      const dir = idx === 0 ? -1 : 1;
      track.scrollBy({ left: dir * 280, behavior: "smooth" });
    };
    sliderNav?.addEventListener("click", onSlider);

    const items = document.querySelectorAll(".exp-item");
    const dots = document.querySelectorAll(".exp-dots span");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const idx = [...items].indexOf(target);
          items.forEach((item) => item.classList.remove("is-active"));
          target.classList.add("is-active");
          applyExpPanel(target);
          dots.forEach((d) => d.classList.remove("active"));
          if (dots[idx]) dots[idx].classList.add("active");
        });
      },
      { root: null, threshold: 0.55 }
    );
    items.forEach((item) => io.observe(item));

    document.querySelectorAll("[onclick]").forEach((el) => {
      el.removeAttribute("onclick");
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      burgerBtn?.removeEventListener("click", onBurger);
      mobileLinks.forEach((a) => a.removeEventListener("click", closeMobile));
      document
        .querySelector(".faq-list")
        ?.removeEventListener("click", onFaqClick);
      sliderNav?.removeEventListener("click", onSlider);
      io.disconnect();
    };
  }, [html]);

  return (
    <>
      <Suspense fallback={null}>
        <LandingLocaleSync />
      </Suspense>
      <div className="landing-root" lang={locale}>
        <div dangerouslySetInnerHTML={{ __html: beforeXlate }} />
        <section className="xlate" id="translation">
          <div className="section-head wrap">
            <span className="eyebrow">Live Translation</span>
            <h2>
              {locale === "en" ? (
                <>
                  One screen in Korean.
                  <br />
                  One in Vietnamese.
                </>
              ) : (
                <>
                  한 화면은 한국어,
                  <br />
                  한 화면은 베트남어
                </>
              )}
            </h2>
            <p>
              {locale === "en"
                ? "Grandma and grandson each write in their language—and receive the other in theirs."
                : "할머니와 손자가 각자 언어로 보내도, 상대에게는 내 언어로 도착합니다."}
            </p>
          </div>
          <div className="xlate-mount wrap">
            <TranslationDemo locale={locale} />
          </div>
        </section>
        <div dangerouslySetInnerHTML={{ __html: afterXlate }} />
      </div>
      {localeEl &&
        createPortal(
          <Suspense fallback={null}>
            <LocaleTabs locale={locale} variant="compact" />
          </Suspense>,
          localeEl
        )}
      {localeMobileEl &&
        createPortal(
          <Suspense fallback={null}>
            <LocaleTabs locale={locale} variant="compact" />
          </Suspense>,
          localeMobileEl
        )}
      {heroEl &&
        createPortal(
          <HeroParticleNetwork
            align="center"
            logoMaskSrc="/tomatok-logo-mask.svg"
          />,
          heroEl
        )}
    </>
  );
}
