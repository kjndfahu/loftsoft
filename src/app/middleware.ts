import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value

    const isLoggedIn = !!session

    const protectedRoutes = ["/profile", "/account"]

    const path = request.nextUrl.pathname

    if (protectedRoutes.some((route) => path.startsWith(route)) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/account/:path*",
    ],
}
