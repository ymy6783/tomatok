import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = DM_Sans({
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
    "TomaTok — TOTT 생태계 공식 사이트. 공지사항과 화이트페이퍼를 확인하세요.",
  openGraph: {
    title: "TomaTok",
    description:
      "TomaTok — TOTT 생태계 공식 사이트. 공지사항과 화이트페이퍼를 확인하세요.",
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
      <body className={`${display.variable} ${body.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
