import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const body = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tomatok.io"),
  title: {
    default: "TomaTok",
    template: "%s | TomaTok",
  },
  description:
    "TomaTok 공식 사이트입니다. 공지사항과 화이트페이퍼를 확인하세요.",
  openGraph: {
    title: "TomaTok",
    description:
      "TomaTok 공식 사이트입니다. 공지사항과 화이트페이퍼를 확인하세요.",
    url: "/",
    siteName: "TomaTok",
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
      <body className={`${body.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
