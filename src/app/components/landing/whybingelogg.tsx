import React from 'react'
import { whatIsBingelogg } from '../lib/about';
import { Inter } from "next/font/google";
import { Why } from '../lib/why';

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export default function WhyBingelogg () {
  return (
    <section className= {`w-full text-xl md:text-2xl px-6 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-8 md:py-12 flex justify-center bg-[#871324] ${interFont.className}`}>
        <div className="items-center">
            <div className="items-center justify-center text-center ">
                <h1 className='text-3xl md:text-5xl text-white mb-11 font-semibold'> Why Bingelogg?</h1>
                    <div className={`grid grid-rows md:grid-cols-2 justify-between gap-8 text-white ${interFont.className}`}>
                      {Why.map((item) => (
                        <div className="flex flex-row gap-2 md:gap-4 max-w-lg items-start" key={item.id}>
                          <div className="shrink-0 w-24 md:w-32 flex justify-center">
                          <i className={`${item.icon} text-[60px] md:text-[75px]`}></i></div>
                          <div className="flex flex-col">
                          <h1 className='text-left text-2xl md:text-3xl font-medium'>{item.head}</h1>
                          <p className='text-left text-lg md:text-xl font-light mt-2'>{item.subline}</p>
                        </div>
                        </div>
                        ))
                      }
                </div>
            </div>
        </div>
    </section>
  )
}