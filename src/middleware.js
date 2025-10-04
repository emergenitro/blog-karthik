import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const protectedRoutes = [
        '/create-blog',
        '/edit-blog',
        '/delete-blog',
        '/dashboard',
        '/admin'
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const session = request.cookies.get('session')?.value;

    const isAuthenticated = session && await decrypt(session);

    if (isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}