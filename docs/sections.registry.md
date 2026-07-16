# Section registry — Tomatok 랜딩

워크플로: `docs/tomatok-workflow.md`  
마스터 플랜: 제품 온보딩 (히어로 말풍선 유지, 나머지 플랜 구조)

| id | name | anchor | source | status | notes |
|----|------|--------|--------|--------|-------|
| header | Header | `#siteHeader` | `landingHtml.ts` + LocaleTabs | draft | Home / Features / Download / News / FAQ |
| hero | Hero | `#top` | `landingHtml.ts` + `HeroLanguageBubbles` | draft | **말풍선 유지** (플랜 WebGL 제외) |
| story | Connection Story | `#story` | `ConnectionStory.tsx` | draft | Imagine… + marquee |
| product | What is TOMATOK | `#product` | `WhatIsBento.tsx` | draft | Bento grid |
| features | Product Experience | `#features` | `landingHtml.ts` sticky | draft | Chat→Wallet sticky |
| why | Why TOMATOK | `#why` | `WhyTomatok.tsx` | draft | Barriers → one solution |
| feature-experience | Feature Experience | `#feature-experience` | `FeatureExperience.tsx` | draft | Hover cards |
| usecases | Use Cases | `#usecases` | `UseCasesGrid.tsx` | draft | 6 glass cards |
| future | Future | `#future` | `FutureTimeline.tsx` | draft | Coming soon timeline |
| news | News | `#news` | HTML + Supabase | shipped | |
| faq | FAQ | `#faq` | `landingHtml.ts` | draft | |
| download | Download | `#download` | `landingHtml.ts` | draft | Ready to connect… |
| notices | 공지 | `/notice` | site routes | shipped | CMS |
| admin | Admin | `/admin` | site routes | shipped | |

Removed from flow (plan replace): AboutConnect, TranslationDemo standalone, Powerful grid, Preview slider, old Coming cards.
