import { NextRequest, NextResponse } from 'next/server';
import config from './config';

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

  // try {
  //   const response = await fetch(`${config.API_BASE_URL}/api/admin/pastors`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`, // Sertakan token dalam header
  //     },
  //   });

  //   // if (!response.ok) {
  //   //   console.log('Token invalid or expired');
  //   //   return NextResponse.redirect(new URL('/auth/login', req.url));
  //   // }
  // } catch (error) {
  //   console.error('Error validating token:', error);
  //   return NextResponse.redirect(new URL('/auth/login', req.url));
  // }

  return NextResponse.next();
}
