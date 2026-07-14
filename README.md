# tomatok.io

Next.js + Supabase 기반 TomaTok 공식 사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000

현재 공지는 `data/notices.json`에서 읽습니다. Supabase 연동은 env 설정 후 진행합니다.

## 환경변수

`.env.local`에 복사:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 배포 (Vercel)

1. GitHub `ymy6783/tomatok` Import
2. Framework: Next.js
3. Deploy
