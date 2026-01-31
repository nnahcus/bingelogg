"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { MediaItem, mediaStatusLabels, mediaTypeLabels } from '../service/type'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z, { set } from 'zod'
import StarRating from './ui/starrating'
import { toast } from 'sonner'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectGroup } from '@/components/ui/select'
import { Inter } from 'next/font/google'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useDebounce from '@/hooks/debounce'
import { useSearchMedia } from '@/hooks/usesearchmedia'

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


interface addMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // allow onSubmit to return a promise so the dialog can await it and properly set isSubmitting
  onSubmit: (item: Omit<MediaItem, 'id' | 'addedDate' | 'updatedAt'>) => void | Promise<void>
  editItem?: MediaItem;
  onCancel: () => void;
}

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["movie", "tvshow", "anime", "manga", "book"]),
  status:  z.enum(["watching", "completed", "planning", "dropped", "on_hold"]),
  rating: z.number().min(0).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
})

type MediaFormValues = z.infer<typeof FormSchema>

export default function AddMedia ({open, onOpenChange, onSubmit, editItem,onCancel}: addMediaDialogProps){
  const [previewImage, setPreviewImage] = useState<string>("")
  const [query, setQuery] = useState<string>("")
  const debounceQuery = useDebounce(query, 500)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<"search" | "manual">("search")


  //  รันใหม่เมื่อมีการแก้ข้อมูลหรือมีการเปลี่ยนค่า media
  const { register, handleSubmit, reset, setValue , control, formState: { errors, isSubmitting } } = useForm<MediaFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      type: 'movie',
      status: 'watching',
      rating: null,
      notes: null,
      imageUrl: null,
    },
    mode: 'onChange',
  })
  // รีเซตฟอร์มเมื่อเปิด/ปิด dialog และมีการแก้ไขข้อมูล
  useEffect (() => {
    if(!open) return;
    // โหลดข้อมูลเดิมเมื่อมีการแก้ไข
    if (editItem) {
      reset({
        title: editItem.title,
        type: editItem.type,
        status: editItem.status,
        rating: editItem.rating ?? null,
        notes: editItem.notes ?? null,
        imageUrl: editItem.imageUrl ?? null,
      });
       setPreviewImage(editItem.imageUrl ?? "");
      // รีเซตค่าเริ่มต้นเมื่อเพิ่มใหม่
    } else {
      reset ({
      title: '',
      type: 'movie',
      status: 'watching',
      rating: null,
      notes: null,
      imageUrl: null,
      })
    }
  }, [open, editItem, reset])

  // debounce ของ query เพื่อป้องกันการเรียกใช้ฟังก์ชันบ่อยเกินไป

  const { data, isLoading, isError, error, isFetching, status, isFetched } = useSearchMedia(debounceQuery)
  
  const searchResults = data ? [
    ...(data.tmdb?.movies ?? []),
    ...(data.tmdb?.tv ?? []),
    ...(data.jikan?.animes ?? []),
    ...(data.jikan?.mangas ?? []),
  ].slice(0,5) : [];

  const resultsPicture = (item: any) => {
    // TMDB
    if (item.poster_path) {
      return `https://image.tmdb.org/t/p/w500${item.poster_path}`
    }
    // Jikan
    if (item.images?.jpg?.image_url) {
      return item.images.jpg.image_url
    }
    return null
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return null
    
    // เลือกไฟล์
    setSelectedFile(file) 
    // พรีวิวรูปก่อนเซฟ
    setPreviewImage(URL.createObjectURL(file))
  }
  const uploadImage = async (file: File): Promise<string | null> => {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/uploadmedia",
              {
                method: "POST",
                body: formData
            });
            
            if(!res.ok) { 
              throw new Error ("Upload Failed!")
            } 
            const data = await res.json();
            return data.url
  }
    // ส่งข้อมูลไปยัง parent component
  const onSubmitForm = async (values: MediaFormValues)  => {
    try {
      let imageUrl = values.imageUrl
      // อัปโหลดตอนมีไฟล์รูปภาพใหม่
      if (selectedFile) {
        setUploading (true)
        imageUrl = await uploadImage (selectedFile)
      }
      
    const mediaData: Omit<MediaItem, 'id' | 'addedDate'| 'updatedAt'> = {
      title: values.title.trim(),
      type: values.type,
      status: values.status,
      rating: values.rating ?? undefined,
      notes: values.notes?.trim() || undefined,
      imageUrl: imageUrl || undefined,
    }

      // Await the parent onSubmit even if it's synchronous so react-hook-form sets isSubmitting
      await Promise.resolve(onSubmit(mediaData))
      reset()
      setSelectedFile(null)
      setPreviewImage("")
      toast.success(editItem ? 'Updated successfully!!' : 'Added successfully!!', 
        {
        style: {
          '--normal-bg': 'var(--background)',
          '--normal-text': '#0A6847',
          '--normal-border': '#0A6847',      
        } as React.CSSProperties
      })
      onOpenChange(false)
    } catch (err) {
      console.error('Submit failed', err)
      toast.error('Failed to save entry. Please try again.')
    } finally {
      setUploading(false)
    }
  }
  // ปิด dialog และรีเซตฟอร์มโดยไม่บันทึกข้อมูล
    const handleCancel = () => {
      reset()
      onCancel()
      setTab("search")
      setSelectedFile(null)
      setPreviewImage("")
      toast.info('Cancelled!!', {
      style: {
        '--normal-bg': 'var(--background)',
        '--normal-text': '#7D7463',
        '--normal-border': '#7D7463',      
      } as React.CSSProperties
    })
      onOpenChange(false)
  }
  return (
    <div className={`${interFont.className}`}>
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button className='w-auto bg-[#5b463f] hover:bg-[#3b2f2f]'>
                <Plus />
               <span className='hidden md:block'> Add entry</span>
            </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-visible overflow-x-hidden' style={{ fontFamily: "Inter" }}>
            <DialogHeader>
                <DialogTitle>
                    Add to collection
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for the media item.
                </DialogDescription>
            </DialogHeader>
            {/* Input ข้อมูลที่ดู */}
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "search" | "manual")} className="mb-4">
              <TabsList className='gap-1 md:gap-4 flex items-center justify-center w-full bg-transparent'>
                <TabsTrigger
                  value="search"
                  className='shrink-0 flex-1 rounded-2xl border-2 border-transparent data-[state=active]:border-[#4B352A]/10 
                  data-[state=active]:bg-[#4E1F00]/20 data-[state=active]:text-[#4B352A] 
                 data-[state=inactive]:text-[#7D7C7C]/80
                  px-4 md:px-6 py-4 font-medium transition-all'
                >
                  Search
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className='shrink-0 flex-1 rounded-2xl border-2 border-transparent data-[state=active]:border-[#4B352A]/10 
                  data-[state=active]:bg-[#4E1F00]/20 data-[state=active]:text-[#4B352A] 
                 data-[state=inactive]:text-[#7D7C7C]/80
                  px-4 md:px-6 py-4 font-medium transition-all'
                >
                  Manual
                </TabsTrigger>
              </TabsList>
                { tab === "search" ? (
                  <TabsContent value="search">
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="search">Search Title</Label>
                      <Input 
                        id="search" 
                        placeholder="Type to search..."
                        className="bg-background"
                        value={query ?? ''}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <ul>
                        { status === 'pending' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            Loading...</div>
                          )}
                        { status === 'success' && isFetching && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            Searching...</div>
                          )}
                        { status === 'error' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                          Search failed. Please try again!!</div>
                          )}
                        { isFetched && searchResults.length === 0 && debounceQuery && !isFetching && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                          No results found :(</div>
                          )}
                        {searchResults.map((item: any, index: number) => {
                          const title = item.title || item.name || "Untitled"
                          const image = resultsPicture(item)
                          const year = 
                          item.release_date?.slice(0,4) ||
                          item.first_air_date?.slice(0,4) || 
                          item.aired?.from?.slice(0,4) || 
                          item.published?.from?.slice(0,4) ||
                          "N/A"
                          return(
                            <li 
                              key={index} 
                              className="p-2 hover:bg-[#f3ece0] rounded-md cursor-pointer"
                              onClick={() => { 
                                setValue('title', title, {shouldDirty: true})
                                setValue('imageUrl', image || null, {shouldDirty: true})
                                setPreviewImage(image || null)
                                setQuery('')
                                setTab("manual")
                              }}
                            >
                              {title} ({year})
                            </li>
                            
                        )
                        })}
                      </ul>
                      </div>
                    </TabsContent>
                ) : (
                  <TabsContent value="manual">
                    <div className="space-y-3">
                      <Label htmlFor="title">Title</Label>
                      <Controller name="title" control={control} render={({field}) => (
                        <Input id="title" placeholder="Enter title..." className="bg-background" value={field.value ?? ''} onChange={field.onChange} />
                      )} />
                      </div>
                  </TabsContent>
                ) }
            </Tabs>

          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <div className='space-y-2 pt-2'>
            <Label htmlFor="status">Status</Label>
            <Controller name="status" control={control} render={({field}) => (
            <Select name={`status`} onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id='status' className='w-full md:w-48'>
              <SelectValue placeholder="Select a status" />
              <SelectContent>
                <SelectGroup>
                  {Object.entries(mediaStatusLabels).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      {label.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectTrigger>
            </Select>
            )}
          />
          </div>
          <div className='space-y-2 md:pt-2'>
            <Label htmlFor="type">Type</Label>
            <Controller name="type" control={control} render={({field}) => (
            <Select name={`type`} onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id='status' className='w-full md:w-48'>
              <SelectValue placeholder="Select a status" />
              <SelectContent>
                <SelectGroup>
                  {Object.entries(mediaTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectTrigger>
            </Select>
            )}
          />
          </div>
          </div>
          <div className="space-y-3 pt-2 flex flex-col">
            <Label id="rating-label">Rating (0-5) </Label>
            {/* รับค่า Rating จาก Star Component ใน form field */}
            <Controller name="rating" control={control} render={({field}) => {
              const rating = field.value ?? undefined
              return (
              <>
              {/* StarRating Component เพื่อให้ผู้ใช้ให้คะแนน */}
              <StarRating onChange={field.onChange} value={rating} aria-labelledby="rating-label"/>
              {/* แสดงข้อความ  ถ้ามีให้แสดง "Rating: X / 5" ไม่มีให้แสดง "Click to rate" */}
              <DialogDescription>{rating ? `Rating: ${rating} / 5` : 'Click to Rate'}</DialogDescription>
              </>
            )}}
             />
            <Label htmlFor="imageUrl">Cover Image (optional)</Label>
             <Input id="imageUrl" 
            className='hidden' 
            ref={fileInputRef} 
            type='file' 
            accept='image/*'
            onChange={handleFileChange}/>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className='size-5'/> Upload Image
            </Button>
            {previewImage && (
              <div className="mt-2">
                <Label className='mb-1'>Image Preview</Label>
                <img src={previewImage} alt="Preview" className="max-h-48 w-auto object-contain rounded-md border"/>
              </div>
            )}
            {(isSubmitting || uploading) && (
              <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin"/>
                Uploading image...
              </div>
            )}
          </div>
          <div className="space-y-3 pt-2 pb-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Your thoughts..." rows={5} className="bg-background resize-none" {...register('notes')}/>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel} disabled={isSubmitting || uploading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#5b463f] hover:bg-[#3b2f2f]" disabled={isSubmitting || uploading}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editItem ? 'Update' : 'Add'} Entry
            </Button>
          </div>
        </form>
        </DialogContent>
    </Dialog>
    </div>
  )
}
