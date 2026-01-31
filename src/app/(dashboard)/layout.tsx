import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import AuthBackground from "../components/authbg";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Dashboard - BingeLogg",
};

export default function LoginLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
      <section className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased min-h-screen`}>
        <SessionProvider>
        <AuthBackground/>
        {children}
        <Toaster position="top-right" style={{ fontFamily: "Inter" }}/>
        </SessionProvider>
      </section>
  );
}