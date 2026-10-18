import type { Metadata } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";

const shipporiMincho = Shippori_Mincho({
  weight: ["500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "女装二つ名メーカー｜A面ステータス＆推定女子力・異名診断",
  description:
    "名前を入力するだけで、あなたの秘められし『女装二つ名（A面称号）』と推定女子力・固有メイクスキルを鑑定！Xで結果カード付きシェアが可能。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${shipporiMincho.className} antialiased min-h-screen bg-[#090308] text-pink-50`}>
        {children}
      </body>
    </html>
  );
}
