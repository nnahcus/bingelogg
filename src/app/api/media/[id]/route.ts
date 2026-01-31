import { MediaSchema } from "@/app/service/schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import z from "zod";

// DELETE - DELETE MEDIA ITEM
export async function DELETE(req: Request, {params}: {params: Promise<{id: string}>}) {
    const session = await auth()

    if(!session?.user?.id){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
// ลบรายการสื่อจากฐานข้อมูล
    const id = Number((await params).id);
    if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid media ID." }, { status: 400 });
    }
    const results = await prisma.mediaItem.deleteMany({
        where: { id, userId: session.user.id }
    })
    // ตรวจสอบว่ามีการลบข้อมูลจริงหรือไม่
    if (results.count === 0) {
        return NextResponse.json({ message: "Media item not found or unauthorized." }, { status: 404 });
    }
    return NextResponse.json({ message: "Media item deleted successfully." }, { status: 200 });
}