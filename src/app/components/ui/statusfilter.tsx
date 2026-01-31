"use client"
import React, { useState } from 'react'
import { mediaStatusLabels, mediaStatusTabLabels } from '@/app/service/type'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MediaTabStatus } from '@/app/service/type'
import { Funnel } from 'lucide-react'

interface MediaStatusProp {
  value: MediaTabStatus
  onChange: (value: MediaTabStatus) => void
}

export default function StatusFilter({ value, onChange }:MediaStatusProp) {

  return (
    <div className=''>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant="outline" className='flex flex-row gap-2 w-10 md:w-24 rounded-lg border-2 border-[#3b2f2f]/30'>
          <Funnel size={20}/>
          <span className='hidden md:block'>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-48' style={{ fontFamily: "Inter" }}>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuGroup>
            {Object.entries(mediaStatusTabLabels).map(([status, label]) => (
                <DropdownMenuCheckboxItem key={status}  checked={value === status} onCheckedChange={() => onChange(status as MediaTabStatus)}>
                    {label}
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
