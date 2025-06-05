import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers/provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
