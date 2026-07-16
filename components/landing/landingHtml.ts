import type { Locale } from "@/lib/locale";
import { localizeLandingHtml } from "@/components/landing/landingCopy";

const landingBodyHtmlKo = `<header id="siteHeader">
  <div class="nav-wrap">
    <a class="logo" href="#top"><span class="dot"></span>TOMATOK</a>
    <nav class="menu">
      <a href="#top">Home</a>
      <a href="#features">Features</a>
      <a href="#download">Download</a>
      <a href="#news">News</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="nav-right">
      <a class="btn btn-primary btn-sm" href="#download">Download App</a>
      <button class="burger" id="burgerBtn" aria-label="메뉴 열기"><span></span></button>
    </div>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="#top">Home</a>
    <a href="#features">Features</a>
    <a href="#download">Download</a>
    <a href="#news">News</a>
    <a href="#faq">FAQ</a>
    <div class="mm-actions">
      <a class="btn btn-primary btn-sm" href="#download">Download App</a>
    </div>
  </div>
</header>

<!-- ============ HERO ============ -->
<section class="hero" id="top">
  <div class="hero-inner">
    <div class="hero-copy">
      <p class="hero-brand">TOMATOK</p>
      <h1>Talk Beyond<br><span class="accent">Language.</span></h1>
      <p class="sub">Every conversation deserves to be understood.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#download">Download App</a>
        <a class="btn btn-ghost" href="#features">Explore Features</a>
      </div>
    </div>
  </div>

  <div class="scroll-cue"><svg class="scroll-arrow" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#9A9BA3"><path d="M204.24,148.24l-72,72a6,6,0,0,1-8.48,0l-72-72a6,6,0,0,1,8.48-8.48L122,201.51V40a6,6,0,0,1,12,0V201.51l61.76-61.75a6,6,0,0,1,8.48,8.48Z"/></svg><span>SCROLL</span><span class="line"></span></div>
</section>

<!--PLAN_STORY-->
<!--PLAN_BENTO-->

<!-- ============ PRODUCT EXPERIENCE (sticky) ============ -->
<section class="experience" id="features">
  <div class="section-head wrap exp-section-head">
    <span class="eyebrow">Product Experience</span>
    <h2>실제로 이렇게 씁니다</h2>
    <p>Chat부터 Wallet까지, 한 장면씩 경험하세요.</p>
  </div>
  <div class="exp-inner">
    <div class="exp-sticky" id="expSticky">
      <div class="exp-num" id="expNum">01 / 06</div>
      <p class="exp-journey" id="expJourney">Chat</p>
      <h3 id="expHeadline">언어가 달라도 자유롭게 소통하세요.</h3>
      <p id="expDesc">토마톡은 AI 실시간 번역을 통해 서로 다른 언어를 사용하는 사람들과도 자연스럽게 대화할 수 있습니다. 한국어로 보낸 메시지는 상대방의 언어로 번역되어 전달되고, 받은 메시지는 다시 내 언어로 표시되어 언어의 장벽 없이 소통할 수 있습니다.</p>
      <ul class="exp-features" id="expFeatures">
        <li>120개국 이상 언어 지원</li>
        <li>AI 실시간 번역</li>
        <li>원문과 번역문 동시 제공</li>
        <li>개인 채팅 및 그룹 채팅 지원</li>
      </ul>
      <div class="exp-dots">
        <span class="active" data-i="0"></span><span data-i="1"></span><span data-i="2"></span>
        <span data-i="3"></span><span data-i="4"></span><span data-i="5"></span>
      </div>
    </div>

    <div class="exp-track" id="expTrack">
      <div class="exp-item is-active"
        data-glow="blue"
        data-num="01 / 06"
        data-journey="Chat"
        data-category="AI Translation"
        data-headline="언어가 달라도 자유롭게 소통하세요."
        data-desc="토마톡은 AI 실시간 번역을 통해 서로 다른 언어를 사용하는 사람들과도 자연스럽게 대화할 수 있습니다. 한국어로 보낸 메시지는 상대방의 언어로 번역되어 전달되고, 받은 메시지는 다시 내 언어로 표시되어 언어의 장벽 없이 소통할 수 있습니다."
        data-features="120개국 이상 언어 지원|AI 실시간 번역|원문과 번역문 동시 제공|개인 채팅 및 그룹 채팅 지원">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-01.png" alt="한국어 ↔ 영어 채팅 번역 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="purple"
        data-num="02 / 06"
        data-journey="Translate"
        data-category="AI Assistant"
        data-headline="대화를 넘어 AI와 함께하는 메신저."
        data-desc="궁금한 내용을 질문하거나, 문장을 자연스럽게 수정하고 번역을 요청하는 등 다양한 작업을 AI Assistant와 함께할 수 있습니다. 메신저 안에서 필요한 정보를 빠르게 얻고 생산성을 높일 수 있습니다."
        data-features="AI 챗봇|번역 및 문장 수정|질문 및 정보 검색|글쓰기 보조">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-02.png" alt="AI Assistant 채팅 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="green"
        data-num="03 / 06"
        data-journey="Voice"
        data-category="Global Community"
        data-headline="전 세계 사람들과 하나의 채팅방에서 소통하세요."
        data-desc="국적이나 언어에 상관없이 다양한 사람들과 그룹 채팅을 즐길 수 있습니다. 모든 참여자는 자신의 언어로 메시지를 읽고 작성할 수 있어 글로벌 커뮤니티에서도 자연스러운 대화가 가능합니다."
        data-features="글로벌 그룹 채팅|실시간 다국어 번역|관심사 기반 커뮤니티|자유로운 국제 소통">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-03.png" alt="글로벌 그룹 채팅 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="amber"
        data-num="04 / 06"
        data-journey="Video"
        data-category="Missions &amp; Games"
        data-headline="매일 즐기고 포인트를 모으세요."
        data-desc="토마톡은 단순한 메신저가 아닙니다. 출석 체크, 오늘의 미션, 미니게임, 다양한 이벤트를 통해 포인트를 획득하며 매일 새로운 즐거움을 경험할 수 있습니다. 획득한 포인트는 꾸준히 모아 다양한 혜택으로 이어질 수 있습니다."
        data-features="출석 체크|오늘의 미션|미니게임|이벤트 참여|포인트 적립">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-04.png" alt="출석 및 미니게임 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="red"
        data-num="05 / 06"
        data-journey="Reward"
        data-category="Rewards &amp; TOTT"
        data-headline="활동이 실제 보상으로 이어집니다."
        data-desc="게임과 미션을 통해 모은 포인트는 일정 조건을 충족하면 TOTT로 교환할 수 있습니다. 또한 친구를 초대하면 추천 보상으로 TOTT를 받을 수 있어 서비스 활동이 더욱 가치 있는 경험으로 이어집니다."
        data-features="Point → TOTT 교환|친구 초대 리워드|추천인 보상|TOTT 적립 현황 확인">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-05.png" alt="포인트 TOTT 교환 및 친구 초대 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="indigo"
        data-num="06 / 06"
        data-journey="Wallet"
        data-category="Wallet Connection"
        data-headline="디지털 자산을 쉽고 안전하게 관리하세요."
        data-desc="토마톡은 Phantom Wallet 연동을 지원하여 보유한 TOTT를 편리하게 확인하고 관리할 수 있습니다. 메신저와 디지털 자산을 하나의 경험으로 연결하여 더욱 확장된 서비스를 제공합니다."
        data-features="Phantom Wallet 연결|TOTT 보유 자산 확인|간편한 Wallet 연동|Web3 서비스 확장">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-06.png" alt="Phantom Wallet 연동 화면" width="320" height="650" /></div>
      </div>
    </div>
  </div>
</section>

<!--PLAN_WHY-->
<!--PLAN_FEATURES-->
<!--PLAN_USECASES-->
<!--PLAN_FUTURE-->

<!-- ============ NEWS ============ -->
<section class="news" id="news">
  <div class="section-head wrap">
    <span class="eyebrow">Newsroom</span>
    <h2>Latest Updates</h2>
    <p>TOMATOK의 새로운 소식을 가장 먼저 만나보세요.</p>
  </div>
  <div class="news-grid"><!--NEWS_GRID--></div>
</section>

<!-- ============ FAQ ============ -->
<section class="faq" id="faq">
  <div class="section-head wrap">
    <span class="eyebrow">FAQ</span>
    <h2>자주 묻는 질문</h2>
  </div>
  <div class="faq-list">
    <div class="faq-item open">
      <div class="faq-q" onclick="toggleFaq(this)">TOMATOK은 어떤 언어를 지원하나요?<span class="plus"></span></div>
      <div class="faq-a"><p>한국어, 영어, 일본어, 중국어를 포함한 120개 이상 언어를 실시간 자동 번역으로 지원합니다.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">TOTT 코인은 어떻게 획득하나요?<span class="plus"></span></div>
      <div class="faq-a"><p>친구 초대, 출석 체크, 미니게임 참여 등 다양한 활동을 통해 TOTT 코인과 포인트를 적립할 수 있습니다.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">번역 정확도는 어느 정도인가요?<span class="plus"></span></div>
      <div class="faq-a"><p>자체 AI 번역 엔진을 통해 실시간 대화에서도 자연스럽고 정확한 번역 품질을 제공합니다.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">지갑 잔액은 안전하게 보관되나요?<span class="plus"></span></div>
      <div class="faq-a"><p>모든 자산 정보는 암호화되어 관리되며, 이상 거래 감지 시스템을 통해 안전하게 보호됩니다.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">어떤 기기에서 사용할 수 있나요?<span class="plus"></span></div>
      <div class="faq-a"><p>iOS와 Android 스마트폰에서 모두 이용 가능하며, 앱스토어와 구글플레이에서 다운로드할 수 있습니다.</p></div>
    </div>
  </div>
</section>

<!-- ============ DOWNLOAD CTA ============ -->
<section class="download" id="download">
  <div class="download-inner wrap">
    <h2>Ready to connect the world?</h2>
    <p>지금 바로 시작하세요. 언어의 장벽 없는 대화가 기다리고 있습니다.</p>
    <div class="store-row">
      <a class="store-btn" href="#">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16.5 2.5c.1 1.2-.4 2.4-1.1 3.2-.8.9-2 1.6-3.2 1.5-.1-1.1.4-2.3 1.1-3.1.8-.9 2.1-1.6 3.2-1.6zM20.8 17c-.5 1.2-.8 1.8-1.5 2.8-1 1.4-2.3 3.2-4 3.2-1.5 0-1.9-1-3.9-1s-2.5 1-4 1c-1.7 0-2.9-1.6-3.9-3-2.7-3.9-3-8.5-1.3-10.9 1.2-1.7 3-2.7 4.7-2.7 1.7 0 2.8 1.1 4.2 1.1 1.3 0 2.2-1.1 4.2-1.1 1.5 0 3.1.8 4.2 2.2-3.7 2-3.1 7.2.9 8.4z" fill="#111114"/></svg>
        <span class="txt"><small>Download on the</small><b>App Store</b></span>
      </a>
      <a class="store-btn" href="#">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3.6 2.6c-.4.3-.6.8-.6 1.4v16c0 .6.2 1.1.6 1.4l9.4-9.4-9.4-9.4z" fill="#00D2FF"/><path d="M17 9l-3.4-2-3.6 3.6 3.6 3.6L17 12c.9-.5.9-2 0-2.5z" fill="#00F076"/><path d="M13.6 12.2L4.1 21.6c.4.2.9.2 1.4-.1l10.3-6-2.2-3.3z" fill="#FF3A44"/><path d="M13.6 9.8l2.2-3.3L5.5 .6C5 .3 4.5.3 4.1.6l9.5 9.2z" fill="#FFCC00"/></svg>
        <span class="txt"><small>GET IT ON</small><b>Google Play</b></span>
      </a>
    </div>
  </div>
</section>

<footer>
  <div class="foot-inner">
    <div>
      <div class="foot-logo"><span class="dot"></span>TOMATOK</div>
      <p style="font-size:13px;max-width:220px;line-height:1.6;">언어의 장벽 없는 글로벌 메신저 플랫폼.</p>
    </div>
    <div class="foot-cols">
      <div class="foot-col">
        <h5>Product</h5>
        <a href="#features">Features</a><a href="#usecases">Use Cases</a><a href="#download">Download</a>
      </div>
      <div class="foot-col">
        <h5>Company</h5>
        <a href="#news">Newsroom</a><a href="/notice">Notices</a><a href="https://github.com/Needspsersand/WHITEOBER-KO" target="_blank" rel="noreferrer">White Paper</a>
      </div>
      <div class="foot-col">
        <h5>Support</h5>
        <a href="#faq">FAQ</a><a href="#">Privacy</a><a href="#">Terms</a>
      </div>
    </div>
  </div>
  <div class="foot-bottom">
    <span>© 2026 TOMATOK. All rights reserved.</span>
    <span>Privacy Policy · Terms of Service</span>
  </div>
</footer>`;

export function getLandingBodyHtml(locale: Locale = "ko"): string {
  return localizeLandingHtml(landingBodyHtmlKo, locale);
}

/** @deprecated Prefer getLandingBodyHtml(locale) */
export const landingBodyHtml = landingBodyHtmlKo;
