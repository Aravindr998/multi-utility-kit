import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "react-day-picker/style.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/tools";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Set the theme class before first paint to avoid a flash of the wrong theme.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;d.classList.remove('light','dark');if(t==='dark'||t==='light'){d.classList.add(t);}else{d.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "free online tools",
    "image compressor",
    "pdf tools",
    "word counter",
    "qr code generator",
    "unit converter",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
