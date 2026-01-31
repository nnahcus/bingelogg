import Loginfrom from '@/app/components/auth/loginfrom'
import Registerfrom from '@/app/components/auth/registerfrom'
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Register",
  description: "Register to create a new account.",
};
const page = () => {
  return (
    <>
    <div className="w-full bg-linear-to-b from-[#ffffff] via-[#faf7f2] to-[#f3ece0]">
    <section className='flex min-h-svh w-full items-center justify-center p-6 '>
    <Registerfrom/>
    </section>
    </div>
    </>
  )
}

export default page