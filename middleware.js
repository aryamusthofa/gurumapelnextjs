import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/siswa') && role !== 'siswa') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/guru') && role !== 'guru') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/siswa/:path*', '/guru/:path*'],
};
