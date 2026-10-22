import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex",
  display: "swap",
})

export const metadata: Metadata = {
  title: "الأسمر | معرض أثاث",
  description: "معرض الأسمر لأثاث غرف المعيشة والنوم والسفرة",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${plex.variable}`}>{children}</body>
    </html>
  );
}
