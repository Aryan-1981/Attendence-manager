import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AttendTrack | Attendance Management",
  description:
    "Modern attendance management system — track, analyze, and manage student attendance with real-time insights.",
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
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-[240px] transition-all duration-300 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto grid-pattern">
                <div className="p-4 md:p-6 pb-20 md:pb-6">
                  {children}
                </div>
              </main>
            </div>
          </div>

          {/* Mobile Nav */}
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
