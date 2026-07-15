import type { Locale } from "@/lib/locale";
import { localizeLandingHtml } from "@/components/landing/landingCopy";

const landingBodyHtmlKo = `<header id="siteHeader">
  <div class="nav-wrap">
    <div class="logo"><span class="dot"></span>TOMATOK</div>
    <nav class="menu">
      <a href="#features">Features</a>
      <a href="#translation">Translation</a>
      <a href="#usecases">Use Cases</a>
      <a href="#news">Updates</a>
      <a href="/notice">Notices</a>
      <a href="#faq">FAQ</a>
      <a href="#download">Download</a>
    </nav>
    <div class="nav-right">
      <span id="landingLocaleMount" class="landing-locale"></span>
      <a class="btn btn-ghost btn-sm" href="/notice">공지사항</a>
      <a class="btn btn-primary btn-sm" href="#download">앱 다운로드</a>
      <button class="burger" id="burgerBtn" aria-label="메뉴 열기"><span></span></button>
    </div>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="#features">Features</a>
    <a href="#translation">Translation</a>
    <a href="#usecases">Use Cases</a>
    <a href="#news">Updates</a>
    <a href="/notice">Notices</a>
    <a href="#faq">FAQ</a>
    <a href="#download">Download</a>
    <div class="mm-actions">
      <span id="landingLocaleMobileMount" class="landing-locale landing-locale-mobile"></span>
      <a class="btn btn-ghost btn-sm" href="/notice">공지사항</a>
      <a class="btn btn-primary btn-sm" href="#download">앱 다운로드</a>
    </div>
  </div>
</header>

<!-- ============ HERO ============ -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy">
      <div class="hero-badge"><span class="pulse"></span> 190개국 실시간 자동 번역</div>
      <h1>Talk Beyond<br><span class="accent">Language.</span></h1>
      <p class="sub">번역, 지갑, AI, 리워드가 하나로 연결된 글로벌 메신저.<br>언어의 장벽 없이, 세상 모든 대화를 시작하세요.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#download">Download App</a>
        <a class="btn btn-ghost" href="#features">Explore Features</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><b>190+</b><span>지원 국가</span></div>
        <div class="stat"><b>52</b><span>지원 언어</span></div>
        <div class="stat"><b>4.9</b><span>스토어 평점</span></div>
      </div>
    </div>
  </div>

  <div class="scroll-cue"><svg class="scroll-arrow" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#9A9BA3"><path d="M204.24,148.24l-72,72a6,6,0,0,1-8.48,0l-72-72a6,6,0,0,1,8.48-8.48L122,201.51V40a6,6,0,0,1,12,0V201.51l61.76-61.75a6,6,0,0,1,8.48,8.48Z"/></svg><span>SCROLL</span><span class="line"></span></div>
</section>

<!-- ============ WHAT IS TOMATOK ============ -->
<section class="about" id="about">
  <div class="about-orbit wrap">
    <div class="about-float af1" title="Chat">
      <img src="/landing/icons/chat.png" alt="Chat" width="40" height="40" />
    </div>
    <div class="about-float af2" title="Translation">
      <img src="/landing/icons/translation.png" alt="Translation" width="40" height="40" />
    </div>
    <div class="about-float af3" title="Wallet">
      <img src="/landing/icons/wallet.png" alt="Wallet" width="40" height="40" />
    </div>
    <div class="about-float af4" title="AI">
      <img src="/landing/icons/ai.png" alt="AI" width="40" height="40" />
    </div>
    <div class="about-float af5" title="Reward">
      <img src="/landing/icons/reward.png" alt="Reward" width="40" height="40" />
    </div>
    <div class="about-float af6" title="Services">
      <img src="/landing/icons/services.png" alt="Services" width="40" height="40" />
    </div>

    <div class="about-core section-head">
      <span class="eyebrow">About Tomatok</span>
      <h2>TOMATOK is more than<br>a messenger.</h2>
      <p>대화, 번역, 자산, AI, 리워드를 하나의 경험으로 연결한<br>글로벌 커뮤니케이션 플랫폼입니다.</p>
    </div>
  </div>
</section>

<!-- ============ LIVE TRANSLATION DEMO ============ -->
<!--TRANSLATION_SECTION-->

<!-- ============ USER JOURNEY (sticky scroll) ============ -->
<section class="experience" id="features">
  <div class="exp-inner">
    <div class="exp-sticky" id="expSticky">
      <div class="exp-num" id="expNum">01 / 06</div>
      <p class="exp-journey" id="expJourney">Talk</p>
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
        data-journey="Talk"
        data-category="AI Translation"
        data-headline="언어가 달라도 자유롭게 소통하세요."
        data-desc="토마톡은 AI 실시간 번역을 통해 서로 다른 언어를 사용하는 사람들과도 자연스럽게 대화할 수 있습니다. 한국어로 보낸 메시지는 상대방의 언어로 번역되어 전달되고, 받은 메시지는 다시 내 언어로 표시되어 언어의 장벽 없이 소통할 수 있습니다."
        data-features="120개국 이상 언어 지원|AI 실시간 번역|원문과 번역문 동시 제공|개인 채팅 및 그룹 채팅 지원">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-01.png" alt="한국어 ↔ 영어 채팅 번역 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="purple"
        data-num="02 / 06"
        data-journey="Ask"
        data-category="AI Assistant"
        data-headline="대화를 넘어 AI와 함께하는 메신저."
        data-desc="궁금한 내용을 질문하거나, 문장을 자연스럽게 수정하고 번역을 요청하는 등 다양한 작업을 AI Assistant와 함께할 수 있습니다. 메신저 안에서 필요한 정보를 빠르게 얻고 생산성을 높일 수 있습니다."
        data-features="AI 챗봇|번역 및 문장 수정|질문 및 정보 검색|글쓰기 보조">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-02.png" alt="AI Assistant 채팅 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="green"
        data-num="03 / 06"
        data-journey="Connect"
        data-category="Global Community"
        data-headline="전 세계 사람들과 하나의 채팅방에서 소통하세요."
        data-desc="국적이나 언어에 상관없이 다양한 사람들과 그룹 채팅을 즐길 수 있습니다. 모든 참여자는 자신의 언어로 메시지를 읽고 작성할 수 있어 글로벌 커뮤니티에서도 자연스러운 대화가 가능합니다."
        data-features="글로벌 그룹 채팅|실시간 다국어 번역|관심사 기반 커뮤니티|자유로운 국제 소통">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-03.png" alt="글로벌 그룹 채팅 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="amber"
        data-num="04 / 06"
        data-journey="Play"
        data-category="Missions &amp; Games"
        data-headline="매일 즐기고 포인트를 모으세요."
        data-desc="토마톡은 단순한 메신저가 아닙니다. 출석 체크, 오늘의 미션, 미니게임, 다양한 이벤트를 통해 포인트를 획득하며 매일 새로운 즐거움을 경험할 수 있습니다. 획득한 포인트는 꾸준히 모아 다양한 혜택으로 이어질 수 있습니다."
        data-features="출석 체크|오늘의 미션|미니게임|이벤트 참여|포인트 적립">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-04.png" alt="출석 및 미니게임 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="red"
        data-num="05 / 06"
        data-journey="Earn"
        data-category="Rewards &amp; TOTT"
        data-headline="활동이 실제 보상으로 이어집니다."
        data-desc="게임과 미션을 통해 모은 포인트는 일정 조건을 충족하면 TOTT로 교환할 수 있습니다. 또한 친구를 초대하면 추천 보상으로 TOTT를 받을 수 있어 서비스 활동이 더욱 가치 있는 경험으로 이어집니다."
        data-features="Point → TOTT 교환|친구 초대 리워드|추천인 보상|TOTT 적립 현황 확인">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-05.png" alt="포인트 TOTT 교환 및 친구 초대 화면" width="320" height="650" /></div>
      </div>
      <div class="exp-item"
        data-glow="indigo"
        data-num="06 / 06"
        data-journey="Own"
        data-category="Wallet Connection"
        data-headline="디지털 자산을 쉽고 안전하게 관리하세요."
        data-desc="토마톡은 Phantom Wallet 연동을 지원하여 보유한 TOTT를 편리하게 확인하고 관리할 수 있습니다. 메신저와 디지털 자산을 하나의 경험으로 연결하여 더욱 확장된 서비스를 제공합니다."
        data-features="Phantom Wallet 연결|TOTT 보유 자산 확인|간편한 Wallet 연동|Web3 서비스 확장">
        <div class="exp-mockup-wrap"><span class="exp-glow" aria-hidden="true"></span><img class="exp-mockup-img" src="/landing/mockups/journey-06.png" alt="Phantom Wallet 연동 화면" width="320" height="650" /></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ POWERFUL FEATURES ============ -->
<section class="powerful">
  <div class="section-head wrap">
    <span class="eyebrow">All-in-one</span>
    <h2>Powerful Features</h2>
    <p>메신저를 넘어, 대화와 자산과 즐거움을 하나로 연결하는 12가지 핵심 기능.</p>
  </div>
  <div class="pgrid">
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(59,130,246,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#3B82F6"><path d="M128,26A102,102,0,0,0,38.35,176.69L26.73,211.56a14,14,0,0,0,17.71,17.71l34.87-11.62A102,102,0,1,0,128,26Zm0,192a90,90,0,0,1-45.06-12.08,6.09,6.09,0,0,0-3-.81,6.2,6.2,0,0,0-1.9.31L40.65,217.88a2,2,0,0,1-2.53-2.53L50.58,178a6,6,0,0,0-.5-4.91A90,90,0,1,1,128,218Z"/></svg></div>
      <h4>Chat</h4><p>빠르고 안정적인 1:1 실시간 메시징.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(139,92,246,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#8B5CF6"><path d="M243.6,148.8a6,6,0,0,1-8.4-1.2A53.58,53.58,0,0,0,192,126a6,6,0,0,1,0-12,26,26,0,1,0-25.18-32.5,6,6,0,0,1-11.62-3,38,38,0,1,1,59.91,39.63A65.69,65.69,0,0,1,244.8,140.4,6,6,0,0,1,243.6,148.8ZM189.19,213a6,6,0,0,1-2.19,8.2,5.9,5.9,0,0,1-3,.81,6,6,0,0,1-5.2-3,59,59,0,0,0-101.62,0,6,6,0,1,1-10.38-6A70.1,70.1,0,0,1,103,182.55a46,46,0,1,1,50.1,0A70.1,70.1,0,0,1,189.19,213ZM128,178a34,34,0,1,0-34-34A34,34,0,0,0,128,178ZM70,120a6,6,0,0,0-6-6A26,26,0,1,1,89.18,81.49a6,6,0,1,0,11.62-3,38,38,0,1,0-59.91,39.63A65.69,65.69,0,0,0,11.2,140.4a6,6,0,1,0,9.6,7.2A53.58,53.58,0,0,1,64,126,6,6,0,0,0,70,120Z"/></svg></div>
      <h4>Group Chat</h4><p>수백 명이 함께하는 대규모 그룹 대화방.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(16,185,129,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#10B981"><path d="M221.59,160.3l-47.24-21.17a14,14,0,0,0-13.28,1.22,4.81,4.81,0,0,0-.56.42l-24.69,21a1.88,1.88,0,0,1-1.68.06c-15.87-7.66-32.31-24-40-39.65a1.91,1.91,0,0,1,0-1.68l21.07-25a6.13,6.13,0,0,0,.42-.58,14,14,0,0,0,1.12-13.27L95.73,34.49a14,14,0,0,0-14.56-8.38A54.24,54.24,0,0,0,34,80c0,78.3,63.7,142,142,142a54.25,54.25,0,0,0,53.89-47.17A14,14,0,0,0,221.59,160.3ZM176,210C104.32,210,46,151.68,46,80A42.23,42.23,0,0,1,82.67,38h.23a2,2,0,0,1,1.84,1.31l21.1,47.11a2,2,0,0,1,0,1.67L84.73,113.15a4.73,4.73,0,0,0-.43.57,14,14,0,0,0-.91,13.73c8.87,18.16,27.17,36.32,45.53,45.19a14,14,0,0,0,13.77-1c.19-.13.38-.27.56-.42l24.68-21a1.92,1.92,0,0,1,1.6-.1l47.25,21.17a2,2,0,0,1,1.21,2A42.24,42.24,0,0,1,176,210Z"/></svg></div>
      <h4>Voice Call</h4><p>선명한 음질의 국제 음성 통화.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(236,72,153,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#EC4899"><path d="M250.83,74.71a6,6,0,0,0-6.16.3L206,100.79V72a14,14,0,0,0-14-14H32A14,14,0,0,0,18,72V184a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V155.21L244.67,181a6,6,0,0,0,9.33-5V80A6,6,0,0,0,250.83,74.71ZM194,184a2,2,0,0,1-2,2H32a2,2,0,0,1-2-2V72a2,2,0,0,1,2-2H192a2,2,0,0,1,2,2Zm48-19.21-36-24V115.21l36-24Z"/></svg></div>
      <h4>Video Call</h4><p>얼굴을 보며 나누는 고화질 화상 통화.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(6,182,212,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#06B6D4"><path d="M245.37,213.32l-56-112a6,6,0,0,0-10.74,0l-22.3,44.6A90,90,0,0,1,105,127.19,101.73,101.73,0,0,0,133.82,62H160a6,6,0,0,0,0-12H102V32a6,6,0,0,0-12,0V50H32a6,6,0,0,0,0,12h89.79A89.71,89.71,0,0,1,96,119.23,89.81,89.81,0,0,1,75.11,86,6,6,0,1,0,63.8,90,101.66,101.66,0,0,0,87,127.2,89.56,89.56,0,0,1,32,146a6,6,0,0,0,0,12,101.55,101.55,0,0,0,64-22.63,102.11,102.11,0,0,0,54.53,22.17l-27.89,55.78a6,6,0,0,0,10.74,5.36L147.71,190h72.58l14.34,28.68A6,6,0,0,0,240,222a5.87,5.87,0,0,0,2.68-.64A6,6,0,0,0,245.37,213.32ZM153.71,178,184,117.42,214.29,178Z"/></svg></div>
      <h4>Translation</h4><p>52개 언어 실시간 자동 번역 엔진.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(245,158,11,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#F59E0B"><path d="M216,66H56a10,10,0,0,1,0-20H192a6,6,0,0,0,0-12H56A22,22,0,0,0,34,56V184a22,22,0,0,0,22,22H216a14,14,0,0,0,14-14V80A14,14,0,0,0,216,66Zm2,126a2,2,0,0,1-2,2H56a10,10,0,0,1-10-10V75.59A21.84,21.84,0,0,0,56,78H216a2,2,0,0,1,2,2Zm-28-60a10,10,0,1,1-10-10A10,10,0,0,1,190,132Z"/></svg></div>
      <h4>Wallet</h4><p>포인트와 TOTT 코인 통합 관리.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(229,57,69,0.10);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#E53945"><path d="M224,50H32A14,14,0,0,0,18,64V192a14,14,0,0,0,14,14H224a14,14,0,0,0,14-14V64A14,14,0,0,0,224,50ZM32,62H224a2,2,0,0,1,2,2V90H30V64A2,2,0,0,1,32,62ZM224,194H32a2,2,0,0,1-2-2V102H226v90A2,2,0,0,1,224,194Zm-18-26a6,6,0,0,1-6,6H168a6,6,0,0,1,0-12h32A6,6,0,0,1,206,168Zm-64,0a6,6,0,0,1-6,6H120a6,6,0,0,1,0-12h16A6,6,0,0,1,142,168Z"/></svg></div>
      <h4>TOTT Pay</h4><p>메신저 안에서 바로 끝내는 간편 결제.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(245,158,11,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#F59E0B"><path d="M216,74H174.74a46.41,46.41,0,0,0,6-4.48,27.56,27.56,0,0,0,9.22-20A30.63,30.63,0,0,0,158.5,18a27.56,27.56,0,0,0-20,9.22A57.1,57.1,0,0,0,128,45.76a57.1,57.1,0,0,0-10.48-18.53A27.56,27.56,0,0,0,97.5,18,30.63,30.63,0,0,0,66,49.51a27.56,27.56,0,0,0,9.22,20,45.74,45.74,0,0,0,6,4.48H40A14,14,0,0,0,26,88v32a14,14,0,0,0,14,14h2v66a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V134h2a14,14,0,0,0,14-14V88A14,14,0,0,0,216,74ZM135.77,63c2.25-12.12,6.29-21.75,11.69-27.85A15.68,15.68,0,0,1,158.86,30h.55A18.6,18.6,0,0,1,178,49.14a15.68,15.68,0,0,1-5.18,11.4C162.1,70,143.92,72.83,134.34,73.65,134.59,70.76,135,67.08,135.77,63ZM83.45,35.45A18.69,18.69,0,0,1,96.59,30h.55a15.68,15.68,0,0,1,11.4,5.18C118,45.9,120.83,64.08,121.65,73.66c-2.89-.25-6.57-.68-10.61-1.43C98.92,70,89.29,65.94,83.19,60.53A15.64,15.64,0,0,1,78,49.14,18.65,18.65,0,0,1,83.45,35.45ZM38,120V88a2,2,0,0,1,2-2h82v36H40A2,2,0,0,1,38,120Zm16,80V134h68v68H56A2,2,0,0,1,54,200Zm148,0a2,2,0,0,1-2,2H134V134h68Zm16-80a2,2,0,0,1-2,2H134V86h82a2,2,0,0,1,2,2Z"/></svg></div>
      <h4>Rewards</h4><p>출석, 초대, 게임으로 매일 적립.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(139,92,246,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#8B5CF6"><path d="M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z"/></svg></div>
      <h4>AI Assistant</h4><p>대화 요약과 스마트 답장 추천.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(236,72,153,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#EC4899"><path d="M173.19,155c-9.92,17.16-26.39,27-45.19,27s-35.27-9.84-45.19-27a6,6,0,0,1,10.38-6c7.84,13.54,20.2,21,34.81,21s27-7.46,34.81-21a6,6,0,1,1,10.38,6ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128ZM92,118a10,10,0,1,0-10-10A10,10,0,0,0,92,118Zm72-20a10,10,0,1,0,10,10A10,10,0,0,0,164,98Z"/></svg></div>
      <h4>Emoji</h4><p>감정을 더 풍부하게 표현하는 이모지.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(16,185,129,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#10B981"><path d="M176,110H152a6,6,0,0,1,0-12h24a6,6,0,0,1,0,12ZM104,98H94V88a6,6,0,0,0-12,0V98H72a6,6,0,0,0,0,12H82v10a6,6,0,0,0,12,0V110h10a6,6,0,0,0,0-12ZM239.84,199.5A34,34,0,0,1,212,214,34.11,34.11,0,0,1,188,204.05l-.26-.28L147.38,158H108.62L68.31,203.76,68,204A34,34,0,0,1,44,214a34,34,0,0,1-33.46-39.91s0-.06,0-.1L26.9,89.88A57.89,57.89,0,0,1,83.89,42H172a58.07,58.07,0,0,1,57.05,47.63c0,.07,0,.12,0,.19L245.46,174s0,.07,0,.11A33.75,33.75,0,0,1,239.84,199.5ZM172,146a46,46,0,0,0,0-92H83.89A45.9,45.9,0,0,0,38.71,92a.36.36,0,0,0,0,.1L22.33,176.23a22,22,0,0,0,37.11,19.45l42-47.65a6,6,0,0,1,4.5-2Zm61.67,30.23-9.79-50.35A58.06,58.06,0,0,1,172,158h-8.63l33.19,37.68a22,22,0,0,0,37.11-19.45Z"/></svg></div>
      <h4>Mini Games</h4><p>친구와 즐기는 가벼운 리워드 게임.</p>
    </div>
    <div class="pcard">
      <div class="icon-blob" style="background:rgba(59,130,246,0.12);"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#3B82F6"><path d="M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-39.76-86.24a6,6,0,0,1,0,8.48l-48,48a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L116,167.51l43.76-43.75A6,6,0,0,1,168.24,123.76Z"/></svg></div>
      <h4>Attendance</h4><p>꾸준한 출석으로 쌓이는 보너스 포인트.</p>
    </div>
  </div>
</section>

<!-- ============ USE CASES ============ -->
<section class="usecases" id="usecases">
  <div class="section-head wrap">
    <span class="eyebrow">Real Life Use Cases</span>
    <h2>어디서든, 누구와도</h2>
    <p>여행지에서, 비즈니스 자리에서, 글로벌 커뮤니티에서 — TOMATOK이 함께합니다.</p>
  </div>
  <div class="uc-grid">
    <div class="uc-card">
      <div class="uc-illust" style="background:linear-gradient(135deg,#FDEBEC,#FCE0E1);">
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#E53945"><path d="M183,113.65l30.1-28.32.13-.13A30,30,0,0,0,170.8,42.77l-.13.13L142.35,73,58.05,42.35a6,6,0,0,0-6.29,1.39l-24,24A6,6,0,0,0,28.67,77l65.92,43.94L77.52,138H56a6,6,0,0,0-4.24,1.76l-24,24a6,6,0,0,0,2,9.82l37.62,15,15,37.56,0,.12a6,6,0,0,0,7.81,3.27,5.94,5.94,0,0,0,2.07-1.41l23.91-23.91A6,6,0,0,0,118,200V178.48l17.07-17.07L179,227.33a6,6,0,0,0,9.23.91l24-24a6,6,0,0,0,1.39-6.29Zm1.94,100.93L141,148.66a6,6,0,0,0-4.4-2.64l-.59,0a6,6,0,0,0-4.24,1.76l-24,24A6,6,0,0,0,106,176v21.52L90.2,213.32,77.57,181.77a6,6,0,0,0-3.34-3.35L42.68,165.8,58.49,150H80a6,6,0,0,0,4.25-1.76l24-24a6,6,0,0,0-.92-9.23L41.42,71.06,57.54,54.93,142,85.63a6,6,0,0,0,6.42-1.53l31-32.9A18,18,0,0,1,204.8,76.66l-32.9,31a6,6,0,0,0-1.53,6.42l30.7,84.41Z"/></svg>
      </div>
      <div class="uc-body">
        <div class="uc-tag">Travel</div>
        <h3>여행</h3>
        <p>실시간 번역으로 낯선 여행지에서도 누구와나 자유롭게 대화하세요.</p>
      </div>
    </div>
    <div class="uc-card">
      <div class="uc-illust" style="background:linear-gradient(135deg,#EAF2FF,#DCEBFF);">
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#3B82F6"><path d="M106,112a6,6,0,0,1,6-6h32a6,6,0,0,1,0,12H112A6,6,0,0,1,106,112ZM230,72V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V72A14,14,0,0,1,40,58H82V48a22,22,0,0,1,22-22h48a22,22,0,0,1,22,22V58h42A14,14,0,0,1,230,72ZM94,58h68V48a10,10,0,0,0-10-10H104A10,10,0,0,0,94,48ZM38,72v42.79A186,186,0,0,0,128,138a185.91,185.91,0,0,0,90-23.22V72a2,2,0,0,0-2-2H40A2,2,0,0,0,38,72ZM218,200V128.37A198.12,198.12,0,0,1,128,150a198.05,198.05,0,0,1-90-21.62V200a2,2,0,0,0,2,2H216A2,2,0,0,0,218,200Z"/></svg>
      </div>
      <div class="uc-body">
        <div class="uc-tag">Business</div>
        <h3>비즈니스</h3>
        <p>해외 파트너와 오해 없이, 빠르고 정확하게 커뮤니케이션하세요.</p>
      </div>
    </div>
    <div class="uc-card">
      <div class="uc-illust" style="background:linear-gradient(135deg,#EAFBF3,#DAF6EA);">
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#10B981"><path d="M243.6,148.8a6,6,0,0,1-8.4-1.2A53.58,53.58,0,0,0,192,126a6,6,0,0,1,0-12,26,26,0,1,0-25.18-32.5,6,6,0,0,1-11.62-3,38,38,0,1,1,59.91,39.63A65.69,65.69,0,0,1,244.8,140.4,6,6,0,0,1,243.6,148.8ZM189.19,213a6,6,0,0,1-2.19,8.2,5.9,5.9,0,0,1-3,.81,6,6,0,0,1-5.2-3,59,59,0,0,0-101.62,0,6,6,0,1,1-10.38-6A70.1,70.1,0,0,1,103,182.55a46,46,0,1,1,50.1,0A70.1,70.1,0,0,1,189.19,213ZM128,178a34,34,0,1,0-34-34A34,34,0,0,0,128,178ZM70,120a6,6,0,0,0-6-6A26,26,0,1,1,89.18,81.49a6,6,0,1,0,11.62-3,38,38,0,1,0-59.91,39.63A65.69,65.69,0,0,0,11.2,140.4a6,6,0,1,0,9.6,7.2A53.58,53.58,0,0,1,64,126,6,6,0,0,0,70,120Z"/></svg>
      </div>
      <div class="uc-body">
        <div class="uc-tag">Community</div>
        <h3>커뮤니티</h3>
        <p>언어 장벽 없는 글로벌 오픈채팅에서 새로운 사람들과 연결되세요.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ APP PREVIEW SLIDER ============ -->
<section class="preview">
  <div class="section-head wrap">
    <span class="eyebrow">App Preview</span>
    <h2>화면으로 미리 보는 TOMATOK</h2>
    <p>메신저부터 지갑, 번역, 서비스, 프로필까지 한눈에 살펴보세요.</p>
  </div>
  <div class="preview-slider">
    <div class="preview-track" id="previewTrack">
      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Messenger</div>
        <div style="padding-top:10px;"><div class="chat-bubble in" style="margin:6px 16px;font-size:12px;">Hi there!</div><div class="chat-bubble out" style="margin:6px 16px;font-size:12px;">안녕하세요!</div></div>
      </div></div></div><h4>Messenger</h4></div>

      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Wallet</div>
        <div class="scr-body"><div class="wallet-hero" style="padding:16px;"><span>총 보유</span><b style="font-size:22px;">128,500P</b></div></div>
      </div></div></div><h4>Wallet</h4></div>

      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Translation</div>
        <div class="scr-body"><div class="scr-row"><div class="rico" style="background:rgba(6,182,212,0.12);">🌐</div><div class="rtext"><b>52개 언어</b><span>실시간 지원</span></div></div></div>
      </div></div></div><h4>Translation</h4></div>

      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Services</div>
        <div class="scr-body"><div class="scr-row"><div class="rico" style="background:rgba(245,158,11,0.12);">🎮</div><div class="rtext"><b>미니게임</b><span>매일 도전</span></div></div></div>
      </div></div></div><h4>Services</h4></div>

      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Profile</div>
        <div class="scr-body" style="text-align:center;padding-top:24px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--red-soft);margin:0 auto 12px;"></div>
          <div style="font-weight:800;font-size:15px;">소이</div>
          <div style="font-size:12px;color:var(--ink-4);margin-top:4px;">@soi_tomatok</div>
        </div>
      </div></div></div><h4>Profile</h4></div>

      <div class="preview-item"><div class="preview-phone"><div class="screen"><div class="scr">
        <div class="scr-header">Chat</div>
        <div style="padding-top:10px;"><div class="chat-bubble in" style="margin:6px 16px;font-size:12px;">See you tomorrow!</div><div class="chat-bubble out" style="margin:6px 16px;font-size:12px;">네 내일 봐요 👋</div></div>
      </div></div></div><h4>Chat</h4></div>
    </div>
    <div class="slider-nav">
      <button class="slider-btn" onclick="scrollPreview(-1)"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#111114"><path d="M222,128a6,6,0,0,1-6,6H54.49l61.75,61.76a6,6,0,1,1-8.48,8.48l-72-72a6,6,0,0,1,0-8.48l72-72a6,6,0,0,1,8.48,8.48L54.49,122H216A6,6,0,0,1,222,128Z"/></svg></button>
      <button class="slider-btn" onclick="scrollPreview(1)"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#111114"><path d="M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z"/></svg></button>
    </div>
  </div>
</section>

<!-- ============ COMING SOON ============ -->
<section class="coming">
  <div class="section-head wrap">
    <span class="eyebrow">Roadmap</span>
    <h2>Coming Soon</h2>
    <p>TOMATOK이 준비하고 있는 다음 이야기.</p>
  </div>
  <div class="coming-grid">
    <div class="coming-card">
      <span class="badge-soon">COMING SOON</span>
      <div class="icon-blob" style="background:rgba(139,92,246,0.12);width:56px;height:56px;border-radius:18px;">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#8B5CF6"><path d="M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z"/></svg>
      </div>
      <h4>AI Assistant</h4>
    </div>
    <div class="coming-card">
      <span class="badge-soon">COMING SOON</span>
      <div class="icon-blob" style="background:rgba(59,130,246,0.12);width:56px;height:56px;border-radius:18px;">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#3B82F6"><path d="M106,112a6,6,0,0,1,6-6h32a6,6,0,0,1,0,12H112A6,6,0,0,1,106,112ZM230,72V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V72A14,14,0,0,1,40,58H82V48a22,22,0,0,1,22-22h48a22,22,0,0,1,22,22V58h42A14,14,0,0,1,230,72ZM94,58h68V48a10,10,0,0,0-10-10H104A10,10,0,0,0,94,48ZM38,72v42.79A186,186,0,0,0,128,138a185.91,185.91,0,0,0,90-23.22V72a2,2,0,0,0-2-2H40A2,2,0,0,0,38,72ZM218,200V128.37A198.12,198.12,0,0,1,128,150a198.05,198.05,0,0,1-90-21.62V200a2,2,0,0,0,2,2H216A2,2,0,0,0,218,200Z"/></svg>
      </div>
      <h4>Business Messenger</h4>
    </div>
    <div class="coming-card">
      <span class="badge-soon">COMING SOON</span>
      <div class="icon-blob" style="background:rgba(245,158,11,0.12);width:56px;height:56px;border-radius:18px;">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#F59E0B"><path d="M26.22,94.41A6,6,0,0,0,26,96v16A38,38,0,0,0,42,143V216a6,6,0,0,0,6,6H208a6,6,0,0,0,6-6V143A38,38,0,0,0,230,112V96a5.91,5.91,0,0,0-.23-1.64L215.43,44.15A14.07,14.07,0,0,0,202,34H54A14.07,14.07,0,0,0,40.57,44.15Zm25.89-47A2,2,0,0,1,54,46H202a2,2,0,0,1,1.92,1.45L216.05,90H40ZM102,102h52v10a26,26,0,0,1-52,0Zm-64,0H90v10a26,26,0,0,1-38.18,23,6,6,0,0,0-1.65-1A26,26,0,0,1,38,112ZM202,210H54V148.66a38,38,0,0,0,42-16.21,37.95,37.95,0,0,0,64,0,38,38,0,0,0,42,16.21Zm3.83-76a6,6,0,0,0-1.65,1A26,26,0,0,1,166,112V102h52v10A26,26,0,0,1,205.83,134Z"/></svg>
      </div>
      <h4>Marketplace</h4>
    </div>
    <div class="coming-card">
      <span class="badge-soon">COMING SOON</span>
      <div class="icon-blob" style="background:rgba(16,185,129,0.12);width:56px;height:56px;border-radius:18px;">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#10B981"><path d="M104,42H56A14,14,0,0,0,42,56v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,104,42Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm-98,34H56a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,104,138Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,200,138Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Z"/></svg>
      </div>
      <h4>Mini Apps</h4>
    </div>
    <div class="coming-card">
      <span class="badge-soon">COMING SOON</span>
      <div class="icon-blob" style="background:rgba(229,57,69,0.10);width:56px;height:56px;border-radius:18px;">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#E53945"><path d="M243.6,148.8a6,6,0,0,1-8.4-1.2A53.58,53.58,0,0,0,192,126a6,6,0,0,1,0-12,26,26,0,1,0-25.18-32.5,6,6,0,0,1-11.62-3,38,38,0,1,1,59.91,39.63A65.69,65.69,0,0,1,244.8,140.4,6,6,0,0,1,243.6,148.8ZM189.19,213a6,6,0,0,1-2.19,8.2,5.9,5.9,0,0,1-3,.81,6,6,0,0,1-5.2-3,59,59,0,0,0-101.62,0,6,6,0,1,1-10.38-6A70.1,70.1,0,0,1,103,182.55a46,46,0,1,1,50.1,0A70.1,70.1,0,0,1,189.19,213ZM128,178a34,34,0,1,0-34-34A34,34,0,0,0,128,178ZM70,120a6,6,0,0,0-6-6A26,26,0,1,1,89.18,81.49a6,6,0,1,0,11.62-3,38,38,0,1,0-59.91,39.63A65.69,65.69,0,0,0,11.2,140.4a6,6,0,1,0,9.6,7.2A53.58,53.58,0,0,1,64,126,6,6,0,0,0,70,120Z"/></svg>
      </div>
      <h4>Community</h4>
    </div>
  </div>
</section>

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
      <div class="faq-a"><p>한국어, 영어, 일본어, 중국어를 포함한 52개 언어를 실시간 자동 번역으로 지원합니다.</p></div>
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
    <h2>Download TOMATOK</h2>
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
        <a href="#faq">FAQ</a><a href="#">Help Center</a><a href="#">Contact</a>
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
