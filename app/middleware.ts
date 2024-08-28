import { NextResponse } from "next/server";

export default function middleware(request: any) {
    const pass = request.cookies.get('authKey')?.value;

    if (!pass || pass === undefined) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/exam'],
};
