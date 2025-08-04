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
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XE9JJ3R2RX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XE9JJ3R2RX');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
