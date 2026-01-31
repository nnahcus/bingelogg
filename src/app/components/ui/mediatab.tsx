import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mediaTabLabels, MediaTabType, mediaTypeLabels } from '@/app/service/type'

interface MediaTypeProp {
  value: MediaTabType
  onChange: (value: MediaTabType) => void
}

export default function MediaTab({ value, onChange }:MediaTypeProp ) {
  return (
    <div className='w-full overflow-x-auto md:overflow-visible'>
        <Tabs value={value} onValueChange={(v) => onChange(v as MediaTabType)}>
            <TabsList className='gap-1 md:gap-4 flex-nowrap justify-start w-max bg-transparent'>
            {Object.entries(mediaTabLabels).map(([status, label]) => (
            <TabsTrigger
              key={status}
              value={status}
              className='shrink-0 rounded-2xl border-2 border-transparent data-[state=active]:border-[#4B352A]/10 
              data-[state=active]:bg-[#4E1F00]/20 data-[state=active]:text-[#4B352A] 
             data-[state=inactive]:text-[#7D7C7C]/80
              px-4 md:px-6 py-4 font-medium transition-all'
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}