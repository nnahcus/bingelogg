import { MediaSchema } from "@/app/service/schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import z from "zod";

// GET - LIST MEDIA AND STATS
export async function GET(req: Request) {
    const session = await auth()

    // ตรวจสอบการล็อกอิน
    if(!session?.user?.id){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูล media และสถิติต่างๆ ของ user พร้อมกัน
    const [mediaList, mediaTotal, mediaWatching, MediaCompleted, MediaAvg] = await Promise.all([
        prisma.mediaItem.findMany({
            where: { userId: session.user.id },
            orderBy: { addedDate: 'desc' }
        }),
        prisma.mediaItem.count({ where: { userId: session.user.id } }),
        prisma.mediaItem.count({ where: { userId: session.user.id, status: 'watching' } }),
        prisma.mediaItem.count({ where: { userId: session.user.id, status: 'completed' } }),
        prisma.mediaItem.aggregate({
            _avg: { rating: true },
            where: { userId: session.user.id, rating: { not: null } }
        })
    ])
    // ส่งข้อมูล media และสถิติต่างๆ กลับไป
    return NextResponse.json({
        mediaList,
        stats: {
            total: mediaTotal,
            watching: mediaWatching,
            completed: MediaCompleted,
            averageRating: Number(MediaAvg._avg.rating?.toFixed(2)) || 0
        }
    });
}

// POST - ADD NEW MEDIA
export async function POST(req: Request) {
    const session = await auth()

    if(!session?.user?.id){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const mediaParsed = MediaSchema.safeParse(body);

    if (!mediaParsed.success) {
        return NextResponse.json({
            message: "Invalid media data!",
            errors: mediaParsed.error.flatten().fieldErrors,
        }, { status: 400 });
    }
// สร้างรายการสื่อใหม่ในฐานข้อมูล
    const newMedia = await prisma.mediaItem.create({
        data: {
            ...mediaParsed.data,
            userId: session.user.id
        }
    });
    return NextResponse.json({ message: "Media added successfully!", media: newMedia }, { status: 201 });
}

// PUT - UPDATE MEDIA ITEM
export async function PUT(req: Request) {
    const session = await auth()

    if(!session?.user?.id){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const mediaParsed = MediaSchema.partial().extend({ id: z.number().int() }).safeParse(body);

    if (!mediaParsed.success) {
        return NextResponse.json({
            message: "Invalid media data!",
            errors: mediaParsed.error.flatten().fieldErrors,
        }, { status: 400 });
    }
    // อัปเดตรายการสื่อในฐานข้อมูล
    const { id, ...updateData } = mediaParsed.data;
// ตรวจสอบว่ามีการอัปเดตข้อมูลจริงหรือไม่
    await prisma.mediaItem.updateMany({
        where: { id, userId: session.user.id },
        data: updateData
    });

    if ((await prisma.mediaItem.count({ where: { id, userId: session.user.id } })) === 0) {
        return NextResponse.json({ message: "Media item not found or unauthorized." }, { status: 404 });
    }

    const media = await prisma.mediaItem.findUnique({
        where: { id },
    });
    return NextResponse.json({ message: "Media item updated successfully.", media }, { status: 200 });
}

