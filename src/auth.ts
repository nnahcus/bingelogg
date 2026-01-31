import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { LoginSchema } from '@/app/components/schema/validation'
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";


export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
    GoogleProvider ({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            }
        },
    }),
    FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) { 
                try {
                    // ตรวจสอบข้อมูลที่รับมาว่าถูกต้องตาม schema หรือไม่
                    const validationConfirmed = LoginSchema.safeParse(credentials);
                    
                    if (!validationConfirmed.success) return null
                        // ดึงข้อมูลที่ผ่านการ validate แล้วออกมา
                    const { email,  password } = validationConfirmed.data;

                    // ค้นหา user จากฐานข้อมูลตาม email
                    const user = await prisma.user.findUnique({ where: { email } })
                    if (!user || !user.password)  return null
                    // ตรวจสอบรหัสผ่าน
                    const isPasswordMatch = await bcryptjs.compare(password, user.password)
                    if (!isPasswordMatch) return null

                    return { id: user.id, email: user.email, name: user.username, image: user.image}
                } catch (error) {
                    console.error('Credentials authorize error:', error)
                    return null
                }
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    pages: { signIn: '/login' },
    callbacks: {
        jwt: async ({ token, user, trigger, session, account }) => {
            try {
                // Nextauth จะส่งค่า object หลังล็อกอิน
                if (user) {
                    token.id = user.id
                    token.email = user.email
                    token.name = user.name
                    token.image = user.image
                }
                // อัปเดตข้อมูล Profile เมื่อมีการอัปเดตข้อมูล เมื่อเรียก update() client-side 
                if (trigger === "update" && session) {
                    token.name = session.name
                    token.image = session.image
                }
                // ดึงข้อมูล user เมื่อมีการล็อกอินผ่าน oauth เช่น facebook/google 
                if (account?.provider === "google" || account?.provider === "facebook") {
                    try {
                        const dbUser = await prisma.user.findUnique({
                            where: { email: token.email as string }
                        });
                        
                        // ถ้าพบ user ใน database ให้เอาข้อมูลนั้นไปใส่ใน token
                        if (dbUser) {
                            token.id = dbUser.id;
                            token.name = dbUser.username;
                            token.email = dbUser.email;
                            token.image = dbUser.image;
                        }
                    } catch (error) {
                        console.error('Error fetching user from database in jwt callback:', error)
                    }
                }

                return token
            } catch (error) {
                console.error('JWT callback error:', error)
                return token
            }
        },
        // ทำงานเมื่อมีการใช้ session 
        // เอาข้อมูลจาก JWT token มาใส่ใน session object เพื่อให้ client สามารถเรียกข้อมูล user ได้
        session: async ({ session, token }) => {
            try {
                if (session.user) {
                    session.user.id = token.id as string
                    session.user.email = token.email as string
                    session.user.name = token.name as string
                    session.user.image = token.image as string
                }
                return session
            } catch (error) {
                console.error('Session callback error:', error)
                return session
            }
        },
    },
})
