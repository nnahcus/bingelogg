import React from 'react'
import { MediaItem, mediaStatusLabels, mediaTypeLabels } from '@/app/service/type'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVerticalIcon, PencilLine, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import StarRating from './ui/starrating'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from "@/components/ui/alert-dialog"
import { Anuphan } from 'next/font/google'

const anuphanFont = Anuphan({
  subsets: ["latin"],
  variable: "--font-anuphan"
})


interface MediaCardProps {
  items: MediaItem[];
  onEdit: (item: MediaItem) => void;
  onDelete: (id: number) => void;
}

export default function MediaCard ({ items, onEdit, onDelete }:MediaCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5 p-4">
  {items.map(item => (
    <div key={item.id} className=" w-full max-w-md overflow-hidden rounded-lg border">
      <div className="relative aspect-2/3 w-full overflow-hidden">
      <img 
        src={item.imageUrl || '/placeholder-image.png'}
        alt={item.title}
        className="w-full h-full object-cover" 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' className='bg-primary/0 hover:bg-primary/10 absolute top-2 right-2 rounded-full'>
          <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-24' style={{ fontFamily: "Inter" }}>
          <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(item)}>
              <PencilLine className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2 text-destructive focus:text-destructive" />
                    Delete
              </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className='w-96' style={{ fontFamily: "Inter" }}>
                <AlertDialogHeader className='text-center gap-0'>
                  <AlertDialogTitle className='text-center'>Delete item</AlertDialogTitle>
                  <AlertDialogDescription className='text-center mt-2 mx-auto'>
                    Are you sure you want to permanently delete this item? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              <AlertDialogFooter className='"flex w-full gap-2 sm:flex-row sm:justify-center'>
              <AlertDialogCancel className='w-full sm:w-1/2'>Cancel</AlertDialogCancel>
              <AlertDialogAction className='w-full sm:w-1/2 bg-[#f32727] hover:bg-[#CB1111] text-white' onClick={() => {onDelete(item.id)}}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      <div className="p-3" style={{fontFamily : "Anuphan"}}>
        <h2 className="text-xl font-medium line-clamp-2">{item.title}</h2>
          {item.rating !== undefined && (
            <div className="flex flex-row gap-2 py-2">
              {item.rating && (<StarRating value={item.rating} color='#FFCB61' emptyColor='#D1D5DB' readonly/>)}
            </div>
          )}
        <div className="flex flex-row gap-1 mt-2" style={{ fontFamily: "Inter" }}>
        <span className={`inline-flex ${mediaTypeLabels[item.type].color} items-center rounded-md p-1 text-[12px] capitalize`}>
          {mediaTypeLabels[item.type].label}
        </span>
        <span className={`inline-flex ${mediaStatusLabels[item.status].color} items-center rounded-md p-1 text-[12px] capitalize`}>
          {mediaStatusLabels[item.status].label}
        </span>
        </div>
      </div>
    </div>
  ))}
</div>
  )
}
