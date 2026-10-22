import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {  IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "react-hot-toast";



const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const siteName = "الخولي للأثاث";
const description =
  "معرض الخولي للأثاث: غرف نوم وسفرة وصالونات وغرف أطفال بخامات متينة وتصميمات عصرية، مع التوصيل والتركيب.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName,
    title: siteName,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/kholy-profile-.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#C8532F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={` ${plex.variable}`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              direction: "rtl",
              fontFamily: "var(--font-plex), Tahoma, Arial, sans-serif",
              border: "1px solid #F0DDD1",
              color: "#3B2A25",
            },
            success: { iconTheme: { primary: "#C8532F", secondary: "#FFFFFF" } },
          }}
        />
        {children}
      </body>
    </html>
  );
}