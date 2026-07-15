import type { Locale } from "@/lib/locale";

/**
 * Korean → English pairs for landing page copy.
 * Applied longest-first so substrings don't collide.
 */
export const LANDING_I18N: [ko: string, en: string][] = [
  // Journey descriptions (longest first)
  [
    "토마톡은 AI 실시간 번역을 통해 서로 다른 언어를 사용하는 사람들과도 자연스럽게 대화할 수 있습니다. 한국어로 보낸 메시지는 상대방의 언어로 번역되어 전달되고, 받은 메시지는 다시 내 언어로 표시되어 언어의 장벽 없이 소통할 수 있습니다.",
    "TomaTok’s real-time AI translation lets you chat naturally with people who speak other languages. Messages you send in Korean are delivered in their language, and messages you receive appear in yours—so conversation flows without a language barrier.",
  ],
  [
    "궁금한 내용을 질문하거나, 문장을 자연스럽게 수정하고 번역을 요청하는 등 다양한 작업을 AI Assistant와 함께할 수 있습니다. 메신저 안에서 필요한 정보를 빠르게 얻고 생산성을 높일 수 있습니다.",
    "Ask questions, polish sentences, or request translations with AI Assistant. Get what you need inside the messenger and stay productive.",
  ],
  [
    "국적이나 언어에 상관없이 다양한 사람들과 그룹 채팅을 즐길 수 있습니다. 모든 참여자는 자신의 언어로 메시지를 읽고 작성할 수 있어 글로벌 커뮤니티에서도 자연스러운 대화가 가능합니다.",
    "Join group chats with people of any nationality or language. Everyone reads and writes in their own language, so global communities feel natural.",
  ],
  [
    "토마톡은 단순한 메신저가 아닙니다. 출석 체크, 오늘의 미션, 미니게임, 다양한 이벤트를 통해 포인트를 획득하며 매일 새로운 즐거움을 경험할 수 있습니다. 획득한 포인트는 꾸준히 모아 다양한 혜택으로 이어질 수 있습니다.",
    "TomaTok is more than a messenger. Check in, complete daily missions, play mini games, and join events to earn points every day. Keep collecting points and unlock more rewards over time.",
  ],
  [
    "게임과 미션을 통해 모은 포인트는 일정 조건을 충족하면 TOTT로 교환할 수 있습니다. 또한 친구를 초대하면 추천 보상으로 TOTT를 받을 수 있어 서비스 활동이 더욱 가치 있는 경험으로 이어집니다.",
    "Points from games and missions can be exchanged for TOTT when conditions are met. Invite friends to earn referral rewards in TOTT—so your activity turns into real value.",
  ],
  [
    "토마톡은 Phantom Wallet 연동을 지원하여 보유한 TOTT를 편리하게 확인하고 관리할 수 있습니다. 메신저와 디지털 자산을 하나의 경험으로 연결하여 더욱 확장된 서비스를 제공합니다.",
    "TomaTok supports Phantom Wallet so you can check and manage your TOTT with ease. Messaging and digital assets come together in one expanded experience.",
  ],

  // Journey headlines
  [
    "언어가 달라도 자유롭게 소통하세요.",
    "Talk freely—even when languages differ.",
  ],
  [
    "대화를 넘어 AI와 함께하는 메신저.",
    "A messenger that goes beyond chat—with AI.",
  ],
  [
    "전 세계 사람들과 하나의 채팅방에서 소통하세요.",
    "Connect with the world in one chat room.",
  ],
  ["매일 즐기고 포인트를 모으세요.", "Play every day and earn points."],
  [
    "활동이 실제 보상으로 이어집니다.",
    "Your activity turns into real rewards.",
  ],
  [
    "디지털 자산을 쉽고 안전하게 관리하세요.",
    "Manage digital assets simply and securely.",
  ],

  // Journey feature lists (|-separated in data + <li> in sticky)
  [
    "120개국 이상 언어 지원|AI 실시간 번역|원문과 번역문 동시 제공|개인 채팅 및 그룹 채팅 지원",
    "120+ languages|Real-time AI translation|Original and translation together|1:1 and group chat",
  ],
  [
    "AI 챗봇|번역 및 문장 수정|질문 및 정보 검색|글쓰기 보조",
    "AI chatbot|Translation &amp; rewriting|Q&amp;A and search|Writing assistance",
  ],
  [
    "글로벌 그룹 채팅|실시간 다국어 번역|관심사 기반 커뮤니티|자유로운 국제 소통",
    "Global group chat|Real-time multilingual translation|Interest-based communities|Borderless conversation",
  ],
  [
    "출석 체크|오늘의 미션|미니게임|이벤트 참여|포인트 적립",
    "Attendance check|Daily missions|Mini games|Events|Earn points",
  ],
  [
    "Point → TOTT 교환|친구 초대 리워드|추천인 보상|TOTT 적립 현황 확인",
    "Point → TOTT exchange|Invite rewards|Referral bonuses|Track TOTT earnings",
  ],
  [
    "Phantom Wallet 연결|TOTT 보유 자산 확인|간편한 Wallet 연동|Web3 서비스 확장",
    "Connect Phantom Wallet|View your TOTT|Easy wallet link|Expand into Web3",
  ],

  // Sticky panel list items (when not from data-features replace alone)
  ["120개국 이상 언어 지원", "120+ languages"],
  ["AI 실시간 번역", "Real-time AI translation"],
  ["원문과 번역문 동시 제공", "Original and translation together"],
  ["개인 채팅 및 그룹 채팅 지원", "1:1 and group chat"],
  ["번역 및 문장 수정", "Translation &amp; rewriting"],
  ["질문 및 정보 검색", "Q&amp;A and search"],
  ["글쓰기 보조", "Writing assistance"],
  ["글로벌 그룹 채팅", "Global group chat"],
  ["실시간 다국어 번역", "Real-time multilingual translation"],
  ["관심사 기반 커뮤니티", "Interest-based communities"],
  ["자유로운 국제 소통", "Borderless conversation"],
  ["출석 체크", "Attendance check"],
  ["오늘의 미션", "Daily missions"],
  ["이벤트 참여", "Events"],
  ["포인트 적립", "Earn points"],
  ["친구 초대 리워드", "Invite rewards"],
  ["추천인 보상", "Referral bonuses"],
  ["TOTT 적립 현황 확인", "Track TOTT earnings"],
  ["Phantom Wallet 연결", "Connect Phantom Wallet"],
  ["TOTT 보유 자산 확인", "View your TOTT"],
  ["간편한 Wallet 연동", "Easy wallet link"],
  ["Web3 서비스 확장", "Expand into Web3"],
  ["AI 챗봇", "AI chatbot"],

  // Image alts
  ["한국어 ↔ 영어 채팅 번역 화면", "Korean ↔ English chat translation"],
  ["AI Assistant 채팅 화면", "AI Assistant chat"],
  ["글로벌 그룹 채팅 화면", "Global group chat"],
  ["출석 및 미니게임 화면", "Attendance and mini games"],
  ["포인트 TOTT 교환 및 친구 초대 화면", "Points-to-TOTT and invite rewards"],
  ["Phantom Wallet 연동 화면", "Phantom Wallet connection"],

  [
    "한 화면은 한국어,<br>한 화면은 베트남어",
    "One screen in Korean.<br>One in Vietnamese.",
  ],
  [
    "할머니와 손자가 각자 언어로 보내도, 상대에게는 내 언어로 도착합니다.",
    "Grandma and grandson each write in their language—and receive the other in theirs.",
  ],

  // Hero / about / sections
  ["190개국 실시간 자동 번역", "Real-time auto-translation in 190+ countries"],
  [
    "번역, 지갑, AI, 리워드가 하나로 연결된 글로벌 메신저.<br>언어의 장벽 없이, 세상 모든 대화를 시작하세요.",
    "A global messenger that connects translation, wallet, AI, and rewards.<br>Start every conversation—without a language barrier.",
  ],
  ["지원 국가", "Countries"],
  ["지원 언어", "Languages"],
  ["스토어 평점", "Store rating"],
  [
    "대화, 번역, 자산, AI, 리워드를 하나의 경험으로 연결한<br>글로벌 커뮤니케이션 플랫폼입니다.",
    "A global communication platform that unites chat, translation,<br>assets, AI, and rewards in one experience.",
  ],
  [
    "메신저를 넘어, 대화와 자산과 즐거움을 하나로 연결하는 12가지 핵심 기능.",
    "Twelve core features that connect conversation, assets, and play—beyond a messenger.",
  ],

  // Powerful feature blurbs
  ["빠르고 안정적인 1:1 실시간 메시징.", "Fast, reliable 1:1 messaging in real time."],
  [
    "수백 명이 함께하는 대규모 그룹 대화방.",
    "Large group chats for hundreds of people.",
  ],
  ["선명한 음질의 국제 음성 통화.", "Crystal-clear international voice calls."],
  [
    "얼굴을 보며 나누는 고화질 화상 통화.",
    "HD video calls face to face.",
  ],
  [
    "52개 언어 실시간 자동 번역 엔진.",
    "Real-time auto-translation across 52 languages.",
  ],
  ["포인트와 TOTT 코인 통합 관리.", "Unified points and TOTT management."],
  [
    "메신저 안에서 바로 끝내는 간편 결제.",
    "Simple payments right inside the messenger.",
  ],
  ["출석, 초대, 게임으로 매일 적립.", "Earn daily via check-ins, invites, and games."],
  [
    "대화 요약과 스마트 답장 추천.",
    "Chat summaries and smart reply suggestions.",
  ],
  [
    "감정을 더 풍부하게 표현하는 이모지.",
    "Emojis that express more of how you feel.",
  ],
  [
    "친구와 즐기는 가벼운 리워드 게임.",
    "Light reward games to play with friends.",
  ],
  [
    "꾸준한 출석으로 쌓이는 보너스 포인트.",
    "Bonus points that grow with steady attendance.",
  ],

  // Use cases
  ["어디서든, 누구와도", "Anywhere, with anyone"],
  [
    "여행지에서, 비즈니스 자리에서, 글로벌 커뮤니티에서 — TOMATOK이 함께합니다.",
    "On the road, at work, or in global communities—TOMATOK is with you.",
  ],
  [
    "실시간 번역으로 낯선 여행지에서도 누구와나 자유롭게 대화하세요.",
    "Chat freely with anyone abroad thanks to real-time translation.",
  ],
  [
    "해외 파트너와 오해 없이, 빠르고 정확하게 커뮤니케이션하세요.",
    "Communicate with overseas partners quickly, clearly, and without mix-ups.",
  ],
  [
    "언어 장벽 없는 글로벌 오픈채팅에서 새로운 사람들과 연결되세요.",
    "Meet new people in global open chats—no language barrier.",
  ],
  ["여행", "Travel"],
  ["비즈니스", "Business"],
  ["커뮤니티", "Community"],

  // Preview
  ["화면으로 미리 보는 TOMATOK", "A first look at TOMATOK"],
  [
    "메신저부터 지갑, 번역, 서비스, 프로필까지 한눈에 살펴보세요.",
    "Messenger, wallet, translation, services, and profile—all at a glance.",
  ],
  ["총 보유", "Total balance"],
  ["52개 언어", "52 languages"],
  ["실시간 지원", "Real-time support"],
  ["매일 도전", "Daily challenges"],
  ["미니게임", "Mini Games"],

  // Coming / news / download / footer
  [
    "TOMATOK이 준비하고 있는 다음 이야기.",
    "What’s next for TOMATOK.",
  ],
  [
    "TOMATOK의 새로운 소식을 가장 먼저 만나보세요.",
    "Be the first to hear what’s new at TOMATOK.",
  ],
  [
    "지금 바로 시작하세요. 언어의 장벽 없는 대화가 기다리고 있습니다.",
    "Get started now. Conversation without language barriers awaits.",
  ],
  [
    "언어의 장벽 없는 글로벌 메신저 플랫폼.",
    "A global messenger platform without language barriers.",
  ],

  // FAQ
  ["자주 묻는 질문", "Frequently asked questions"],
  [
    "TOMATOK은 어떤 언어를 지원하나요?",
    "Which languages does TOMATOK support?",
  ],
  [
    "한국어, 영어, 일본어, 중국어를 포함한 52개 언어를 실시간 자동 번역으로 지원합니다.",
    "We support real-time auto-translation across 52 languages, including Korean, English, Japanese, and Chinese.",
  ],
  ["TOTT 코인은 어떻게 획득하나요?", "How do I earn TOTT?"],
  [
    "친구 초대, 출석 체크, 미니게임 참여 등 다양한 활동을 통해 TOTT 코인과 포인트를 적립할 수 있습니다.",
    "Earn TOTT and points through invites, daily check-ins, mini games, and more.",
  ],
  ["번역 정확도는 어느 정도인가요?", "How accurate is the translation?"],
  [
    "자체 AI 번역 엔진을 통해 실시간 대화에서도 자연스럽고 정확한 번역 품질을 제공합니다.",
    "Our AI translation engine delivers natural, accurate quality even in real-time chat.",
  ],
  [
    "지갑 잔액은 안전하게 보관되나요?",
    "Is my wallet balance kept safe?",
  ],
  [
    "모든 자산 정보는 암호화되어 관리되며, 이상 거래 감지 시스템을 통해 안전하게 보호됩니다.",
    "All asset data is encrypted and protected with anomaly detection.",
  ],
  ["어떤 기기에서 사용할 수 있나요?", "Which devices can I use?"],
  [
    "iOS와 Android 스마트폰에서 모두 이용 가능하며, 앱스토어와 구글플레이에서 다운로드할 수 있습니다.",
    "Available on iOS and Android—download from the App Store and Google Play.",
  ],

  // Nav / chrome
  ["앱 다운로드", "Download App"],
  ["공지사항", "Notices"],
  ["메뉴 열기", "Open menu"],
];

const WHITEPAPER = {
  ko: "https://github.com/Needspsersand/WHITEOBER-KO",
  en: "https://github.com/Needspsersand/WHITEOBER",
} as const;

export function localizeLandingHtml(baseHtml: string, locale: Locale): string {
  let html = baseHtml;

  if (locale === "en") {
    const pairs = [...LANDING_I18N].sort((a, b) => b[0].length - a[0].length);
    for (const [ko, en] of pairs) {
      if (!ko) continue;
      html = html.split(ko).join(en);
    }
  }

  // Locale-aware notice links + white paper
  if (locale === "en") {
    html = html
      .replaceAll('href="/notice"', 'href="/notice?lang=en"')
      .replaceAll(WHITEPAPER.ko, WHITEPAPER.en);
  } else {
    html = html.replaceAll(WHITEPAPER.en, WHITEPAPER.ko);
  }

  return html;
}

export function landingEmptyNewsTitle(locale: Locale): string {
  return locale === "en" ? "Check the notices" : "공지사항을 확인하세요";
}
