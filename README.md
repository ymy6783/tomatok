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
   - `supabase/add-category.sql` (기존 테이블만 있는 경우)  
   - `supabase/add-i18n.sql`  
   - `supabase/add-slug.sql`  
   - `supabase/seed-notices.sql` (WP에서 가져온 공지 33건 → 테이블)  
   - `supabase/storage-notices.sql` (관리자 이미지 업로드용)
3. **Authentication → Users → Add user** 로 관리자 이메일/비밀번호 생성
4. **Project Settings → API** 에서 URL / `anon` key 복사

`.env.local` / Vercel Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# 선택: 이미지 Storage 업로드 import용 (절대 커밋하지 말 것)
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://tomatok.io
```

### WP 공지 → DB 넣기 (이미지 주소까지)

이미지는 `public/notices/`에 미러링되어 있습니다. Git push 후 `https://tomatok.io/notices/...` 로 제공됩니다.

**방법 A — SQL 시드 (간단)**  
`node scripts/build-seed-sql.mjs` 후 Supabase SQL Editor에서 `supabase/seed-notices.sql` 실행.

**방법 B — Storage 업로드 + upsert (권장, 수정 가능)**  
`.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 추가 후:

```bash
# SQL Editor에서 미리: add-slug.sql, storage-notices.sql
node --env-file=.env.local scripts/import-notices.mjs
```

이미지를 Supabase Storage `notices` 버킷에 올리고, HTML/`images` 컬럼 URL을 Storage 공개 주소로 바꾼 뒤 테이블에 upsert합니다.  
이후 `/admin` 로그인하면 수정·삭제가 가능합니다 (UUID id).

관리자 글쓰기: `/admin/login` → `/admin/notices/new`

## 배포 (Vercel)

1. GitHub `ymy6783/tomatok` Import
2. Framework: Next.js
3. Environment Variables에 Supabase 키 추가
4. Deploy
