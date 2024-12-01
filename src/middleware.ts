import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Abaikan file statis
  if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  const publicPaths = ['/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  console.log('Path:', req.nextUrl.pathname);
  console.log('Token:', token);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}
