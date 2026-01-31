import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Loginfrom from '@/app/components/auth/loginfrom'
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Log In",
  description: "Login to access your account.",
};

const page = () => {
  return (
    <div className='"w-full bg-linear-to-b from-[#ffffff] via-[#faf7f2] to-[#f3ece0]'>
    <section className='flex min-h-svh w-full items-center justify-center p-6'>
    <Loginfrom/>
    </section>
    </div>
  )
}

export default page