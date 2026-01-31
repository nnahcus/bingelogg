"use client"
import StatsOverview from '@/app/components/stats-overview'
import { MediaItem, MediaStats } from '@/app/service/type'
import MediaCard from '@/app/components/card'
import { useEffect, useState } from 'react'
import Greeting from '@/app/components/ui/greeting'
import AddMedia from '@/app/components/mediadialog'
import { Inter } from 'next/font/google'
import MediaTab from '@/app/components/ui/mediatab'
import StatusFilter from '@/app/components/ui/statusfilter'
import { MediaTabType, MediaTabStatus } from '@/app/service/type'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import  { redirect } from 'next/navigation'
import { toast } from 'sonner'
import AvatarProfile from '@/app/components/avatar'

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function page () {
    const [items, setItems] = useState<MediaItem[]>([])
    const [open, setOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MediaItem | undefined>(undefined)
    const [typeFilter, setTypeFilter] = useState<MediaTabType>('all')
    const [statusFilter, setStatusFilter] = useState<MediaTabStatus>('all')
    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === 'unauthenticated') {
        redirect('/login');
      }
    }, [status]);

    useEffect(() => {
      if (status !== 'authenticated') return;

      // Fetch media items from API
      const fetchMediaItems = async () => {
        const response = await fetch('/api/media');
          if (!response.ok) {
            throw new Error('Failed to fetch media items');
          }
          const data = await response.json();
          setItems(data.mediaList);
      };

      fetchMediaItems();
    }, [status]);
    

    // Filter MediaType ับ Status + All
    const FilteredItems = items?.filter(item => {
      const matchesTypeTab = typeFilter === "all" || item.type === typeFilter;
      const matchesStatusTab = statusFilter === "all" || item.status === statusFilter;
      return matchesTypeTab && matchesStatusTab;
    }) || [];
    
    // เพิ่มข้อมูล
    const HandleSubmitItem = async (item: Omit<MediaItem, 'id' | 'addedDate' | 'updatedAt'>) =>{
      await new Promise(r => setTimeout(r, 2000))
      const payload = editingItem ? { ...item, id: editingItem.id } : item

      const response = await fetch('/api/media', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to save media item');
      }
      const { media } = await response.json();
      // อัพเดตรายการใน state
      setItems(prev => editingItem ? prev.map(i => i.id === editingItem.id ? media : i) : [...prev, media]);
      setOpen(false);
      setEditingItem(undefined)
    }

    const HandleEditItem = (item: MediaItem) => {
      setEditingItem(item)
      setOpen(true)
    }
    // ยกเลิก/ปิด + dialog รีเซ็ตค่า edit
    const HandleCancelItem = () => {
      setEditingItem(undefined)
      setOpen(false)
    }
    // ลบรายการ
    const HandleDeleteItem = async (id: number) => {
      try{
        const response = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete media item');
        }
        setItems(prev => prev.filter(i => i.id !== id))
        ; 
        toast.success('Deleted successfully!!', {
        style: {
          '--normal-bg': 'var(--background)',
          '--normal-text': '#0A6847',
          '--normal-border': '#0A6847',
      } as React.CSSProperties
    });
      } catch {
        toast.error('Delete failed Please try again :((', {
            style: {
              '--normal-bg': 'var(--background)',
              '--normal-text': '#D84040',
              '--normal-border': '#D84040',      
            } as React.CSSProperties
          });
      }
    }
  return (
  <div className={`w-full bg-linear-to-b from-[#ffffff] via-[#faf7f2] to-[#f3ece0] ${interFont.className}`}>
    <section className='flex min-h-svh w-full p-6 flex-col'>
      <AvatarProfile/>
      <Greeting/>
      <StatsOverview items={items}/>
      <div className="p-6 gap-4 justify-start">
        <h2 className='text-xl font-medium'>You have tracked {FilteredItems.length} {FilteredItems.length === 1 ? 'list' : 'lists'}</h2>
      </div>
      <div className="justify-between flex px-2 md:px-6">
      <MediaTab onChange={setTypeFilter} value={typeFilter}/>
      <div className="justify-end flex items-center gap-2 md:gap-4">
      <StatusFilter onChange={setStatusFilter} value={statusFilter}/>
      <AddMedia onSubmit={HandleSubmitItem} editItem={editingItem} onCancel={HandleCancelItem} onOpenChange={setOpen} open={open}/>  
      </div>
      </div>    
      <main>
        {FilteredItems.length === 0 ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-4 text-center py-20'>
        <h3 className='text-2xl text-zinc-700'>
          {items.length === 0 ? "No entry.  Start tracking to see your progress!!" : "No items match your filters :(("}
        </h3>          
        <AddMedia onSubmit={HandleSubmitItem} editItem={editingItem} onCancel={HandleCancelItem} onOpenChange={setOpen} open={open}/>
        </div>
        ) : (
      <MediaCard items={FilteredItems} onEdit={HandleEditItem} onDelete={HandleDeleteItem}/>
        )
        }
      </main>
      
    </section>
    </div>
  )
}