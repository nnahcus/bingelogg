import React from 'react'
import { UserRound, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, stringToColor } from '../service/avatar';
import { Anuphan, Inter } from 'next/font/google';
import UpdateProfile from './updateprofile';

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anuphanFont = Anuphan({
  subsets: ["latin"],
  variable: "--font-anuphan"
})

export default function AvatarProfile() {
  const { data: session } = useSession();
  return (
    <div className={`flex justify-end ${interFont.className}`}>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="px-2 md:px-6">
            <Button className="relative h-14 w-14 rounded-full " variant="ghost">
              <Avatar className='h-12 w-12'>
                <AvatarImage src={session?.user?.image || undefined }/>
              <AvatarFallback className='font-light text-lg  text-white' style={{backgroundColor : stringToColor(session?.user?.name || "User")}} >
                {getInitials(session?.user?.name)}
                </AvatarFallback>
            </Avatar>
            </Button>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='sm:max-w-sm' style={{ fontFamily: "Inter" }}>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-base leading-none">{session?.user?.name}</p>
                <p className="text-muted-foreground text-sm leading-none">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <UpdateProfile/>
            <DropdownMenuItem onClick={() => signOut({callbackUrl: '/', redirect: true})} className="text-destructive focus:text-destructive text-base">
                <LogOut className='w-4 h-4 text-destructive focus:text-destructive'/>
                Log Out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}