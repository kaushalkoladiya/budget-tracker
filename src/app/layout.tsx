import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallBanner from "@/components/ui/InstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track income, expenses, budgets, and debts—all in one place",
  manifest: "/manifest.json",
  themeColor: "#4CAF50",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Budget Tracker"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InstallBanner />
        {children}
      </body>
    </html>
  );
}
