import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/home', '/home/blogs', '/login', '/register', '/reset-password', '/verify-user', '/forgot-password', '/setup'];

const phoneRoutes = ['/initial-setup'];

export function middleware(req: NextRequest) {
    let user = req.cookies.get('user');

    if (req.nextUrl.pathname.startsWith('/public')) {
        return NextResponse.next();
    }

    if (req.nextUrl.pathname.includes('campaign-reporting')) {
        if (!user) {
            let url = new URL(req.nextUrl.href);
            if (url.searchParams.has('isPublic')) {
                return NextResponse.next();
            }
            url.searchParams.append('isPublic', 'true');
            return NextResponse.redirect(url.href);
        }
    }

    if (req.nextUrl.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    if (req.nextUrl.pathname.startsWith('/images')) {
        return NextResponse.next();
    }

    if (req.nextUrl.pathname.includes('blogs/')) {
        authRoutes.push(req.nextUrl.pathname);
    }

    const hostname = req.nextUrl.hostname;

    if (!user && !authRoutes.includes(req.nextUrl.pathname)) {
        const page = hostname.includes('youngun') ? '/login' : '/home';
        return NextResponse.redirect(req.nextUrl.origin + page);
    }

    if (user) {
        let parsedUser = JSON.parse(user?.value || '{}') as User;
        if (!parsedUser.mobileNo && !phoneRoutes.includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(req.nextUrl.origin + '/initial-setup');
        } else if (parsedUser.mobileNo && phoneRoutes.includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(req.nextUrl.origin + '/');
        }
    }

    if (user && authRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(req.nextUrl.origin + '/');
    }

    return NextResponse.next();
}
