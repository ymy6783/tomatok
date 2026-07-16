# Tomatok 사이트 워크플로

레포: https://github.com/ymy6783/tomatok (로컬: 이 워크스페이스)  
스택: Next.js · 랜딩 · 공지(Supabase) · KO/EN

힐링펫(Expo 화면 자동화)과 **별개**. 여기는 **섹션 단위 사이트** 방식.

## 최종 목표

랜딩 **UI/UX·카피 개선** + 공지 **운영(CMS)**.  
그릴 때 끝이 아니라, 브라우저에서 보고 스스로 고칠 때까지가 한 사이클.

| 영역 | 진실(Source of truth) |
|------|------------------------|
| 랜딩 UI/카피 | **코드** (`components/landing/*`, `app/landing.css`) |
| 공지·소식 본문 | **Supabase** (관리자 `/admin`) |
| 기획·브랜드 참고 | Figma (있으면 **섹션 frame** 링크만) |

## 루프

```
의도/카피 → 섹션 코드 수정 → localhost 또는 Vercel Preview에서 확인
  → 자체 UX 리뷰·수정 (2~3라운드) → push
공지 추가·수정 = 관리자 (디자인 자동화와 분리)
```

## 섹션 단위 (앱 화면 아님)

→ `docs/sections.registry.md`

| 변경 | 절차 |
|------|------|
| 추가 | 레지스트리 row + HTML/컴포넌트 섹션 + 앵커 메뉴 |
| 수정 | **그 섹션만** (`landingHtml` 또는 React 컴포넌트) |
| 삭제 | 레지스트리 `removed` + 마크업·nav 링크 제거 |

Figma: **섹션 frame 링크(`?node-id=`)** 만 구현에 사용. 파일 전체는 탐색용.

## 코드 구조 원칙

- 카피 KO/EN → `landingCopy.ts` (하드코딩 문자열 남발 금지)
- 인터랙션 섹션 → React 컴포넌트 (예: `TranslationDemo`) — `dangerouslySetInnerHTML` 안에 포탈하지 말 것
- 손대는 섹션부터 `landingHtml.ts` 거대 문자열에서 **컴포넌트로 분리** 권장
- 공지 목록/상세 → `app/(site)/notice/*` + `lib/notices.ts`

## 이동 중 보기

- `main` / PR → **Vercel** Preview·Production URL
- `localhost`는 밖에서는 안 열림

## 에이전트 자체 UX 리뷰 (필수)

1. 브라우저로 해당 섹션 스크린샷
2. 이미지 직접 읽고 체크리스트로 문제 목록
3. 물어보지 말고 수정 (2~3라운드)
4. 애매한 카피·브랜드만 사용자에게 확인

### 체크리스트 (랜딩)

- [ ] 첫 뷰포트: 브랜드 + 한 메시지 + CTA (과밀·통계 남발 금지 — 사용자 프론트 규칙 준수)
- [ ] 섹션당 목적 하나, 헤드라인 + 짧은 보조 문장
- [ ] 카드·뱃지·칩 남발 없음 (상호작용 필요할 때만 카드)
- [ ] KO/EN 전환 후 깨진 문구·잘린 레이아웃 없음
- [ ] 모바일 헤더·햄버거·앵커 스크롤 정상
- [ ] 대비·가독성, CTA hit area 충분

## 자동화 범위

| 하면 좋음 | 하지 않음 |
|-----------|-----------|
| 섹션 단위 PR, Vercel Preview | Figma ↔ 사이트 전체 미러 |
| 공지 EN 스크립트 (`notices:translate-en*`) | 공지 본문을 랜딩 HTML에 하드코딩 |
| 자체 스크린샷 UX 리뷰 | 사용자에게 다른 AI로 캡처 넘기게 두기 |

## Cursor 규칙

`.cursor/rules/tomatok-site.mdc`
