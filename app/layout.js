import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CBT System - Premium",
  description: "Computer Based Test System with Premium UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-500/30`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
