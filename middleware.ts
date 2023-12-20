// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
//@ts-expect-error
import { jws } from 'jsrsasign';

export function middleware(req: NextRequest) {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = req.headers.get('Cookie')
    ? cookie.parse(req.headers.get('Cookie')!)
    : {};

  req.cookies.getAll();
  const response = NextResponse.next();

  if (cookies.Bearer) {
    try {
      const isValid = jws.JWS.verifyJWT(cookies.Bearer, APP_SECRET, {
        alg: ['HS256'],
      });
      if (!isValid) {
        response.cookies.delete('Bearer');
        response.cookies.delete('userId');
      }

      response.cookies.set('Bearer', cookies.Bearer, {
        maxAge: 180 * 24 * 60 * 60,
      });
      cookies.userId &&
        response.cookies.set('userId', cookies.userId, {
          maxAge: 180 * 24 * 60 * 60,
        });

      //temporarily disable redirect
      // if (req.nextUrl.pathname === '/' && isValid) {
      //   const url = req.nextUrl.clone();
      //   url.pathname = '/courses';
      //   return NextResponse.redirect(url, { status: 302 });
      // }
    } catch (err) {
      //@ts-expect-error
      console.log('TOKEN error - injection attempt', err.message);
    }
  }

  return response;
}
