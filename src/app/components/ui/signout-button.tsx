import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function LogoutButton() {
  return (
  <Button onClick={() => signOut({callbackUrl: '/', redirect: true})} className='w-auto bg-[#5b463f] hover:bg-[#3b2f2f]'>
        Log out
    </Button>
  )
}
