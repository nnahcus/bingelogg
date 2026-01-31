import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const runtime = "nodejs";


const DEFAULT_REDIRECT = "/dashboard"
const PUBLIC_ROUTES =["/login", "/register", "/"]
const API_ROUTES = "/api/auth"

export default auth((req) => {
  try {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
    const isApiRoute = nextUrl.pathname.startsWith(API_ROUTES)
    if (isApiRoute) return NextResponse.next();
    if (isLoggedIn && isPublicRoute) return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    if (!isLoggedIn && !isPublicRoute) return NextResponse.redirect(new URL('/login', nextUrl));
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}