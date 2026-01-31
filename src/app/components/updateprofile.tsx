"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpdateProfileForm, UpdateProfileValidation } from "./schema/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Inter } from 'next/font/google'
import React, { useEffect, useRef, useState } from 'react'
import { Loader2, PlusCircleIcon, UserRound } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { updateProfile } from '../action/updateUsername'
import { getInitials, stringToColor } from '../service/avatar';




export default function UpdateProfile(){
      const { data: session, update } = useSession();
      const [open, setOpen] = useState(false)
      const [previewImage, setPreviewImage] = useState<string>("")
      const [selectedFile, setSelectedFile] = useState<File | null>(null)

      const fileInputRef = useRef<HTMLInputElement>(null)

      const { register: editProfile, handleSubmit, reset, control, setValue , watch, formState: { errors, isSubmitting } } = useForm<UpdateProfileForm>({
        resolver: zodResolver(UpdateProfileValidation),
        defaultValues:{
            username: "",
            image: ""
        }
      })

      useEffect (() => {
          // โหลดข้อมูลเดิม
          if (session?.user) {
            reset({
              username: session.user.name ?? '',
              image: session.user.image ?? ''
            });
            setPreviewImage(session.user.image ?? "");
          } 
          }, [session, reset])


      // Handle file selection
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return null

        // เลือกไฟล์
        setSelectedFile(file) 
        // พรีวิวรูปก่อนเซฟ
        setPreviewImage(URL.createObjectURL(file))
      }
      //  อัปเดตโปรไฟล์
      const onSubmit = async (values: UpdateProfileForm)  => {
        try { 
          // เก็บรูปปัจจุบันก่อนเปลี่ยนรูปภาพ
          let imageUrl = values.image 
          // อัปโหลดตอนมีไฟล์รูปภาพใหม่
          if (selectedFile) {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const res = await fetch("/api/upload",
              {
                method: "POST",
                body: formData
            });
            
            if(!res.ok) { 
              throw new Error ("Upload Failed!")
            } 
            
            // ดึง url ของรูปใหม่ที่อัปโหลดเสร็จแล้ว
            const data = await res.json();
            // อัปเดต imageUrl เป็น url ของรูปใหม่
            imageUrl = data.url 
          }
            // อัปเดต profile โดยสร้าง form
            const newData = new FormData()
            newData.append("username", values.username)
            newData.append("image", imageUrl ?? "")
            await updateProfile(newData)
            
            // อัปเดต session ให้ sync กับ Nextauth session โดยไม่ต้องรีใหม่
            await update({
              name: values.username,
              image: imageUrl || ""
            })

            toast.success('Updated profile successfully!!', 
              {
              style: {
                '--normal-bg': 'var(--background)',
                '--normal-text': '#0A6847',
                '--normal-border': '#0A6847',      
              } as React.CSSProperties
            })

            setOpen(false)
        } catch (err) {
            console.error('Update failed', err)
            toast.error('Failed to update prpfile. Please try again.!!')
          }
        }
        // ปิด dialog และรีเซตฟอร์มโดยไม่บันทึกข้อมูล
          const handleCancel = () => {
            reset()
            toast.info('Update profile cancel!', {
            style: {
              '--normal-bg': 'var(--background)',
              '--normal-text': '#7D7463',
              '--normal-border': '#7D7463',      
            } as React.CSSProperties
          })
            setOpen(false)
        }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className='text-base'>
            <UserRound className='w-4 h-4'/>
            Profile
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className='sm:max-w-sm' style={{ fontFamily: "Inter" }}>
          <DialogHeader>
            <DialogTitle className='text-xl'>Edit Profile</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center">
            <div className="relative w-fit">
            <Avatar className='h-20 w-20 '>
              <AvatarImage src={previewImage || session?.user?.image || undefined }/>
              <AvatarFallback className='font-light text-2xl  text-white' style={{backgroundColor : stringToColor(session?.user?.name || "User")}} >
                {getInitials(session?.user?.name)}
              </AvatarFallback>
              </Avatar>
              <button type="button" onClick={() => fileInputRef.current?.click()} className='focus-visible:ring-ring/50 absolute -right-1 -bottom-1 inline-flex cursor-pointer items-center justify-center rounded-full focus-visible:ring-[3px] focus-visible:outline-none'>
                <PlusCircleIcon className='text-background size-7 fill-slate-400'/>
              </button>
              </div>
              </div>
              <div className="my-2">
              <p className='text-zinc-600 text-sm space-y-3'> For the best results, Please use a square picture :)</p>
            </div>
            <div className="space-y-3 pt-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Add your name..." className="bg-background" {...editProfile("username")}/>
          </div>
          <div className="space-y-3 pt-2 pb-2">
            <Label htmlFor="notes">Email</Label>
            <Input id="notes" placeholder="Your Email" className="bg-background resize-none disabled:bg-[#4B352A]/20" value={(session?.user?.email || "")} disabled/>
          </div>
          <input 
            className='hidden' 
            ref={fileInputRef} 
            type='file' 
            accept='image/*'
            onChange={handleFileChange}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#5b463f] hover:bg-[#3b2f2f]" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Change
            </Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
