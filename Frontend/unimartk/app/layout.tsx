import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import TanstackProviders from "./providers/tanstack-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { AuthProvider } from "../modules/auth/contexts/authContext";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackProviders>
            <AuthProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
              <Toaster />
            </AuthProvider>
          </TanstackProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}