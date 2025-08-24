import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AroundU",
  description: "Discover and explore events & games near you with EventNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthSessionProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              theme="system"
              className="font-mono text-sm"
              toastOptions={{
                classNames: {
                  toast:
                    "bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg font-mono",
                  title: "font-bold text-foreground font-mono",
                  description: "text-gray-700 dark:text-gray-300 font-mono",
                  actionButton:
                    "bg-foreground text-background font-semibold rounded-lg px-2 py-1",
                  cancelButton:
                    "bg-transparent border border-gray-300 dark:border-gray-600 text-foreground rounded-lg px-2 py-1",
                },
              }}
            />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
