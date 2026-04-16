import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demandly - 做大家真正想要的产品",
  description:
    "你投票，我开发。提交你的需求，票数最高的需求每周上线一个。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg text-text-primary antialiased min-h-screen">
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
