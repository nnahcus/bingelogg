import { calculateStats } from '@/app/service/media'
import { MediaItem } from '@/app/service/type'
import React from 'react'
import { Notebook, StarIcon, CircleCheck, TvMinimalPlay } from 'lucide-react'

export default function StatsOverview ({ items = [] }: {items?: MediaItem[]}) {
    const stats = calculateStats(items)
    const mainstats = [
        {label: 'Total' ,value: stats.total, icon: Notebook, 
          bg: 'bg-slate-200' , text: 'text-zinc-600'},
        {label: 'In Progress' ,value: stats.inProgress, icon: TvMinimalPlay,
          bg: 'bg-blue-200', text: 'text-sky-600'
        },
        {label: 'Completed', value: stats.completed, icon: CircleCheck,
          bg: 'bg-green-200', text: 'text-emerald-600'
        },
        {label: 'Avg rating', value: stats.average!= null ? stats.average.toFixed(2) : '-', icon: StarIcon,
          bg: 'bg-yellow-200', text: 'text-amber-500'
        }
    ]
return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
        {mainstats.map(stat => (
        <div
          key={stat.label}
          className="rounded-lg bg-white w-full max-w-xs h-24 p-4 md:p-6 shadow items-center flex gap-4"
        >
          <div className={`flex justify-center items-center rounded-lg ${stat.bg} p-2 w-12 h-12`}>
            <stat.icon strokeWidth={1.5} size={30} className={`${stat.text}`}/></div>
          <div className="flex flex-col ">
          <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
          <p className="text-base md:text-xl font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


