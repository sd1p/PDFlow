"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/context/ChatContext";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkAPIProvider } from "@/components/ClerkAPIProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Echo App",
//   description: "A chat application built with Next.js and Socket.io",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClerkAPIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ChatProvider>{children}</ChatProvider>
            </ThemeProvider>
          </ClerkAPIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
