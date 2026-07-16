'use client';

export default function AboutConnectNetwork({
  locale,
}: {
  locale: 'ko' | 'en';
}) {
  return (
    <div className="about-connect about-connect--plain">
      <div className="about-core section-head">
        <span className="eyebrow">About Tomatok</span>
        <h2>
          {locale === 'en' ? (
            <>
              Everything connected
              <br />
              in one Tomatok.
            </>
          ) : (
            <>
              대화·번역·자산·AI를
              <br />
              하나로 연결합니다.
            </>
          )}
        </h2>
        <p>
          {locale === 'en'
            ? 'Chat, translation, wallet, AI, and rewards—linked into one global communication experience.'
            : '대화, 번역, 자산, AI, 리워드를 하나의 경험으로 연결한 글로벌 커뮤니케이션 플랫폼입니다.'}
        </p>
      </div>
    </div>
  );
}
