import React from 'react'
import { Button } from '@/components/ui/button'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import { Frown } from 'lucide-react';
import type { Metadata } from "next";


const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function EmptyState (){
  return (
    <div className="w-full bg-linear-to-b from-[#ffffff] via-[#faf7f2] to-[#f3ece0]">
    <div className={`min-h-screen flex flex-col justify-center items-center ${interFont.className}`}>
    <div className="text-center items-center">
        <h2 className='text-8xl font-semibold text-zinc-700/30'>
            404        
        </h2>
        <h3 className='text-3xl font-bold py-2'>
          Page not found
        </h3>
        <p className='pb-2 font-light'>Oops! We can't not find the page you're looking for :( </p>  
        </div>
          <Link href="/" className="flex  h-12 w-full items-center justify-center gap-2 rounded-xl text-white py-2 px-3 bg-[#5b463f] hover:bg-[#3b2f2f] transition-colors  md:w-[158px]"
            rel="noopener noreferrer">
            Go to Homepage
          </Link>  
    </div>
    </div>
  )
}