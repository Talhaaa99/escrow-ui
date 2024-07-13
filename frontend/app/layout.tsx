import "./globals.css";
import { Metadata, Viewport } from "next";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Toaster as DefaultToaster } from "@/registry/default/ui/toaster";
import { Toaster as NewYorkSonner } from "@/registry/new-york/ui/sonner";
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <div vaul-drawer-wrapper="">
            <div className="relative flex min-h-screen flex-col bg-background">
              {children}
            </div>
          </div>
          <NewYorkToaster />
          <DefaultToaster />
          <NewYorkSonner />
        </body>
      </html>
    </>
  );
}
