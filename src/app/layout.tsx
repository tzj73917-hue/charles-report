import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "方塊學堂｜魔術方塊新手教學",
    template: "%s｜方塊學堂",
  },
  description: "用 3D 互動方塊，七個步驟學會還原三階魔術方塊。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-8 text-center text-sm text-muted">
          <p>方塊學堂 · 用層先法七步還原三階魔術方塊</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-accent/70">
            CUBE//LAB · SYSTEM ONLINE
          </p>
        </footer>
      </body>
    </html>
  );
}
