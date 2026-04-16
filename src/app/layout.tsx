import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body className="bg-bg text-text-primary antialiased min-h-screen">
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
