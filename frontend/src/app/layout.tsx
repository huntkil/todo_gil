import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RealtimeNotificationProvider } from "@/components/RealtimeNotificationProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo Gil - 업무 관리 도구",
  description: "자연어 입력, 실시간 알림, 캘린더 연동이 가능한 업무 관리 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RealtimeNotificationProvider>
          {children}
        </RealtimeNotificationProvider>
      </body>
    </html>
  );
}
