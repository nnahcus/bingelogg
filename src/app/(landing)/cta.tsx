import React from 'react'
import { Inter } from "next/font/google";
import Link from 'next/link';

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export default function Cta (){
  return (
        <section className= {`w-full text-xl md:text-2xl px-6 sm:px-8 md:px-12 lg:px-24 xl:px-36 pt-16 md:pt-24 flex justify-center items-center bg-[#3b2f2f] ${interFont.className}`}>
        <div className="items-center">
            <div className="items-center justify-center text-center ">
                <h1 className="text-4xl md:text-5xl font-semibold leading-10 tracking-tight text-[#E5E5E5] dark:text-zinc-50 mb-6">
                    Start tracking your media — for free
                    </h1>
          <p className="text-xl md:text-2xl font-light leading-8 text-zinc-300 dark:text-zinc-200 mb-8">
            Join Bingelogg and create your personal media journey today.
          </p>
        </div>
        <button className="flex flex-col gap-4 text-base font-medium sm:flex-row items-center justify-center mx-auto pb-20">
          <Link href="/login"  className="uppercase flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d99a7e] px-5 text-white transition-colors hover:bg-[#c77557] md:w-[158px]"
            rel="noopener noreferrer">
            get started
          </Link>
        </button>
                </div>
        </section>
  )
}
