'use server'

import { prisma } from "@/lib/db"


export async function avatarUser(userId: string){
    return await prisma.user.findUnique({ 
        where: { id: userId },
        select: {
            id: true,
            username: true,
            image: true,
            email: true,
        }
    })
}