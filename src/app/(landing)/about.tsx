import React from 'react'
import { whatIsBingelogg } from '../components/lib/constants/about';
import { Inter } from "next/font/google";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export default function About () {
  return (
    <section className= {`w-full px-6 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-8 md:py-12 flex justify-center bg-[#3b2f2f] ${interFont.className}`}>
        <div className="items-center">
            <div className="items-center justify-center text-center ">
                <h1 className='text-3xl md:text-5xl text-white mb-8 font-semibold'> What is Bingelogg?</h1>
                <p className="text-lg md:text-xl  py-1 font-light font-poppins text-white whitespace-pre-line"> {whatIsBingelogg.description}</p>
            </div>
        </div>
    </section>
  )
}
