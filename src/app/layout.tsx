import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardProvider from "../lib/providers/dashboard-provider";
import { Toaster } from "../components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doc Templater: Take Control of Your Time Today!",
  description:
    "Manage your time effortlessly with Doc Templater app. create template, set meeting. Gain real-time insights into your time manegement habits",
  keywords: [
    "budget tracker",
    "financial planning",
    "time management",
    "budgeting",
    "expenses",
  ],
  authors: [
    { name: "Ahmed Najmudeen", url: "https://www.github.com/Jumi525/" },
  ],
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
        <DashboardProvider>
          {children}
          <Toaster />
        </DashboardProvider>
      </body>
    </html>
  );
}
