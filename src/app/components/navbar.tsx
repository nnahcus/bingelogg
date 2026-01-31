"use client";
import Link from 'next/link'
import React from 'react'
import { usePathname } from "next/navigation";
import { Inter, Plus_Jakarta_Sans, Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const plusjakartas = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plusjakartas',
  weight: [ '200', '300', '400', '500', '600', '700'],
});

export default function Navbar() {

  return (
    <nav className="w-full h-16 bg-transparent fixed top-0 text-xl md:text-2xl flex items-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-2 md:py-4 justify-between">
      <div className={`${plusjakartas.className} font-medium uppercase text-2xl md:text-3xl text-[#3b2f2f]`}>Bingelogg</div>
      <div className="gap-4 flex">
      <button className={`outline-2 outline-solid outline-[#d99a7e] hover:outline-[#c77557] hover:text-[#c77557] text-[#d99a7e] px-4 py-2 rounded-md text-sm md:text-base ${inter.className}`}>
        <Link href="/login" rel="noopener noreferrer">
        Log in
        </Link>
      </button>
      <button className={`bg-[#d99a7e] text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-[#c77557] transition-colors ${inter.className}`}>
      <Link href="/register" rel="noopener noreferrer">
        Get started
      </Link>
      </button>
      </div>
    </nav>
  )
}