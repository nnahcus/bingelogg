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
      <div className={`${plusjakartas.className} font-medium uppercase text-2xl md:text-3xl text-[#E5E5E5]`}>Bingelogg</div>
      <div className="gap-4 flex">
      <button className={`outline-2 outline-solid outline-[#C42138] hover:outline-[#871234] hover:text-[#871234] text-[#C42138] px-4 py-2 rounded-md text-sm md:text-base ${inter.className}`}>
        Log in
      </button>
      <button className={`bg-[#C42138] text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-[#871234] transition-colors ${inter.className}`}>
        Get started
      </button>
      </div>
    </nav>
  )
}