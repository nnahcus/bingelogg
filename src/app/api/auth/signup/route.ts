export const runtime = "nodejs"

import { FormSchema } from "@/app/components/schema/validation";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // ตรวจสอบข้อมูลที่รับมาว่าถูกต้องตาม schema หรือไม่
        const validationField = FormSchema.safeParse(body)

        if (!validationField.success) {
            return NextResponse.json({
                message: "Invalid fields!",
                errors: validationField.error.flatten().fieldErrors,
            }, { status: 400 });
        }
        // ดึงข้อมูลที่ผ่านการ validate แล้วออกมา
        const { email, username, password } = validationField.data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        // ตรวจสอบว่ามี user ที่มี email นี้อยู่แล้วหรือไม่
        if (existingUser) {
            return NextResponse.json(
                { message: "This email already in use!!" },
                { status: 409 }
            )
        }
        // แฮชพาสเวิร์ด
        const hashedPassword = await hash(password, 12)
        // สร้าง user ใหม่ในฐานข้อมูล
        const NewUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })
        // สร้าง user ใหม่เสร็จแล้ว ส่ง response กลับ
        return NextResponse.json(
            { user: NewUser, message: "Create user successfully!!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("REGISTER_ERROR", error)
        return NextResponse.json(
            { message: "Something went wrong!!" },
            { status: 500 }
        )
    }
}