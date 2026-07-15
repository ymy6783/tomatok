import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tomatok.io"),
  title: {
    default: "TOMATOK · Talk Beyond Language",
    template: "%s | TOMATOK",
  },
  description:
    "번역, 지갑, AI, 리워드가 하나로 연결된 글로벌 메신저 TOMATOK.",
  openGraph: {
    title: "TOMATOK · Talk Beyond Language",
    description:
      "번역, 지갑, AI, 리워드가 하나로 연결된 글로벌 메신저 TOMATOK.",
    url: "/",
    siteName: "TOMATOK",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={`${redHatDisplay.variable} antialiased`}>{children}</body>
    </html>
  );
}
