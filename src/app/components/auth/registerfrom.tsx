"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2,} from 'lucide-react'
import { sns } from '../lib/constants/sns'
import Link from 'next/link'
import { Inter } from "next/font/google";
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { FormSchema } from '../schema/validation'
import { UserForm } from '../schema/validation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'


const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Registerfrom () {
const router = useRouter();
const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)



const registerForm = useForm<UserForm>({
    resolver: zodResolver(FormSchema),
    defaultValues:{
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
});

const onSubmit = async (data: UserForm) => {
    try {
        await new Promise(r => setTimeout(r, 2000))

        const response = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

        const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
    } 
      toast.success(result.message || "Register Successful!!",
        {
        style: {
          '--normal-bg': 'var(--background)',
          '--normal-text': '#0A6847',
          '--normal-border': '#0A6847',      
        } as React.CSSProperties
      });
      router.push('/login')
    }catch (err: any) {
        toast.error(err?.message || "Something went wrong!! Please try again later!",{
            style: {
                '--normal-bg': 'var(--background)',
                '--normal-text': '#D84040',
                '--normal-border': '#D84040',      
            } as React.CSSProperties
        })
    }
}

return (
<div className={`bg-white rounded-2xl shadow-xl/20 p-4 w-full max-w-md ${interFont.className}`}>
    <div className="text-center py-4">
        <h1 className={`text-2xl md:text-3xl font-medium ${interFont.className}`}>Create your Bingelogg!!</h1>
    </div>
   <Form  {...registerForm}>
    <form onSubmit={registerForm.handleSubmit(onSubmit)} className='w-full space-y-2' noValidate>
        {/* Email */}
        <FormField control={registerForm.control} name="email" render={({ field }) => (
            <FormItem className='gap-2'>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                    <Input id="email" type="email" placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        {/* Username */}
        <FormField control={registerForm.control} name="username" render={({ field }) => (
            <FormItem className='gap-2'>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                    <Input id="username" type="username" placeholder="iLoveBingelogg"  {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        {/* Password */}
        <FormField control={registerForm.control} name="password" render={({ field }) => (
            <FormItem className='gap-2'>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                    <div className='relative'>
                        <Input id="password" 
                        type={showPassword ? 'text' : "password"} 
                        placeholder="******"  {...field} />
                        <button  type="button" onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showPassword  ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        {/* ConfirmPassword */}
        <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
            <FormItem className='gap-2' >
                <FormLabel htmlFor="confirmPassword">Confirm your password</FormLabel>
                <FormControl>
                    <div className='relative'>
                        <Input id="confirmPassword" type={showConfirmPassword ? 'text' : "password"} placeholder="******"  {...field} />
                        <button  type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showConfirmPassword  ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <Button type='submit' className='w-full space-y-2 py-2 my-2 bg-[#5b463f] hover:bg-[#3b2f2f]' disabled={registerForm.formState.isSubmitting}>
            {registerForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Register
            </Button>
    </form>
   </Form>


<div className="py-2 flex items-center gap-4">
  <div className="flex-1 h-px bg-neutral-300" />
  <span className="text-xs text-neutral-500">OR</span>
  <div className="flex-1 h-px bg-neutral-300" />
</div>
    <div className="flex flex-col gap-1 space-y-2 py-2">
        {sns.map((social) =>(
            <Button key={social.id} type='button' onClick={() => signIn(social.provider, {callbackUrl: '/dashboard'})} className="w-full h-10 border text-[#3b2f2f] flex items-center justify-starts pl-10 bg-background p-3 gap-10 hover:bg-[#f2f2f2] cursor-pointer">
                <img src={social.icon} className="h-5 w-5"/>
                <h3 className='text-sm md:text-base font-normal'>Continue with {social.name}</h3>
            </Button>
        ))

        }
    </div>
    <div className="space-y-2 py-2 text-center">
        <p>Already have an account? <Link href="/login" className='text-base hover:underline text-[#c77557]'>Click here!</Link></p>
    </div>

</div>
  )
}
