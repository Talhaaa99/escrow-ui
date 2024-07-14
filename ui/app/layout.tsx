// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/navbar";
import AppWalletProvider from "@/components/AppWalletProvider";

const fontHeading = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
};

export default Layout;
