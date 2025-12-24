import React from 'react'
import { Inter } from "next/font/google";
import { How } from '../lib/howitworks';
import { h1 } from 'motion/react-client';

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function HowItworks () {
  return (
        <section className= {`w-full text-xl md:text-2xl px-6 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-12 flex justify-center bg-[#242424] ${interFont.className}`}>
            <div className="items-center">
                <div className="justify-center text-center ">
                    <h1 className='text-3xl md:text-5xl text-white mb-11 font-semibold'> How it works?</h1>
                    <div className={`flex flex-col md:flex-row justify-between gap-8 text-white ${interFont.className}`}>
                      {How.map((item) => (
                        <div className="flex flex-col items-start max-w-sm" key={item.id}>
                          <div className="flex justify-center w-full">
                          <div className="w-30 h-30 flex justify-center items-center rounded-full border-4 border-solid border-[#C42138]">
                            <span className='text-5xl font-light'>{item.id}</span></div></div>
                          <h1 className='text-left text-2xl md:text-3xl font-medium mt-6'>{item.head}</h1>
                          <p className='text-left text:lg md:text-xl font-light mt-2'>{item.subline}</p>
                        </div>
                        ))
                      }
                </div>
            </div>
            </div>
        </section>
  )
}
