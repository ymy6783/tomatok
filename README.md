# tomatok.io

Next.js + Supabase 기반 TomaTok 공식 사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000

현재 공지는 Supabase `notices` 테이블을 쓰거나, env가 없을 때 `data/notices.json`으로 동작합니다.

## Supabase 게시판 세팅

1. [supabase.com](https://supabase.com) → **New project** (예: `tomatok`)
2. **SQL Editor**에서 순서대로 실행  
   - `supabase/schema.sql`  
   - `supabase/seed-notices.sql` (기존 공지 33건)
3. **Authentication → Users → Add user** 로 관리자 이메일/비밀번호 생성
4. **Project Settings → API** 에서 URL / `anon` key 복사

`.env.local` / Vercel Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

관리자 글쓰기: `/admin/login` → `/admin/notices/new`

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000

## 배포 (Vercel)

1. GitHub `ymy6783/tomatok` Import
2. Framework: Next.js
3. Environment Variables에 Supabase 키 추가
4. Deploy
