import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전국 시티투어 맛집 지도",
  description: "지역과 음식 종류로 맛집을 찾는 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
