import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prairie Supply Co.",
  description: "Quality farm & ranch supplies. Serving Western Canada since 1909. Shop feed, fencing, equipment, workwear and more.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {/* Global Top Bar */}
        <div className="bg-[var(--brand-green)] text-white text-sm py-2 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="font-medium">100% Canadian Owned &amp; Operated</span>
            </div>
            <div className="hidden md:block text-white/70 text-xs">Serving Western Canada since 1909</div>
          </div>
        </div>

        <Navbar />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
