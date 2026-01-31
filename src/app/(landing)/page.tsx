import { Inter } from "next/font/google";
import Hero from "./hero";
import About from "./about";
import WhyBingelogg from "./whybingelogg";
import HowItworks from "./howitworks";
import Cta from "./cta";
import { auth } from "@/auth";
import  { redirect } from 'next/navigation'


const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function Home() {
  const session = await auth()
  if (session){
    redirect("/dashboard")
  }
  return (
    <> 
    
    <Hero/>
    <About/>
    <WhyBingelogg/>
    <HowItworks/>
    <Cta/>
    </>
  );
}
