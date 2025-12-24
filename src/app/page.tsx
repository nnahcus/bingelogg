import { Inter } from "next/font/google";
import Hero from "./components/landing/hero";
import About from "./components/landing/about";
import WhyBingelogg from "./components/landing/whybingelogg";
import HowItworks from "./components/landing/howitworks";
import Cta from "./components/landing/cta";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Home() {
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
