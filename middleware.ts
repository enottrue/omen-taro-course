// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
//@ts-expect-error
import { jws } from 'jsrsasign';

// Список страниц, доступных только оплаченным пользователям
const PAID_ONLY_PAGES = [
  '/courses',
  '/course_book',
  '/lesson',
  '/onboarding'
];

// Список страниц, доступных всем пользователям
const PUBLIC_PAGES = [
  '/',
  '/payment/success',
  '/payment/cancel',
  '/reset-password',
  '/api'
];

export async function middleware(req: NextRequest) {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = req.headers.get('Cookie')
    ? cookie.parse(req.headers.get('Cookie')!)
    : {};

  req.cookies.getAll();
  const response = NextResponse.next();

  // Проверяем, является ли текущая страница публичной
  const isPublicPage = PUBLIC_PAGES.some(page => req.nextUrl.pathname.startsWith(page));
  const isPaidOnlyPage = PAID_ONLY_PAGES.some(page => req.nextUrl.pathname.startsWith(page));

  if (cookies.Bearer) {
    try {
      const isValid = jws.JWS.verifyJWT(cookies.Bearer, APP_SECRET, {
        alg: ['HS256'],
      });
      
      if (!isValid) {
        response.cookies.delete('Bearer');
        response.cookies.delete('userId');
      } else {
        // Если токен валидный и есть userId, проверяем статус оплаты
        if (cookies.userId) {
          try {
            // Строим правильный URL, используя HTTP для localhost и HTTPS для production
            const host = req.headers.get('Host') || 'localhost:3000';
            const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
            const protocol = isLocalhost ? 'http:' : 'https:';
            const apiUrl = `${protocol}//${host}/api/users/${cookies.userId}`;
            
            console.log('🔍 Middleware: Fetching user data from:', apiUrl);
            console.log('🔍 Middleware: User ID from cookie:', cookies.userId);
            
            const userResponse = await fetch(apiUrl, {
              headers: {
                'Cookie': req.headers.get('Cookie') || '',
              },
            });

            console.log('🔍 Middleware: Response status:', userResponse.status);

            if (userResponse.ok) {
              const userData = await userResponse.json();
              
              console.log('🔍 Middleware: Raw user data:', userData);
              console.log('🔍 Middleware: User data:', {
                id: userData.user.id,
                email: userData.user.email,
                isPaid: userData.user.isPaid,
                updatedAt: userData.user.updatedAt,
                currentPath: req.nextUrl.pathname
              });
              
              // Если пользователь оплатил и находится на главной странице, перенаправляем на onboarding
              if (userData.user.isPaid && req.nextUrl.pathname === '/') {
                console.log('🔄 Redirecting paid user from / to /onboarding');
                const url = req.nextUrl.clone();
                url.pathname = '/onboarding';
                return NextResponse.redirect(url, { status: 302 });
              }
              
              // Если пользователь не оплатил и пытается получить доступ к защищенной странице
              if (!userData.user.isPaid && isPaidOnlyPage) {
                console.log('🔄 Redirecting unpaid user from protected page to /');
                const url = req.nextUrl.clone();
                url.pathname = '/';
                return NextResponse.redirect(url, { status: 302 });
              }
            } else {
              console.error('❌ Middleware: Failed to fetch user data. Status:', userResponse.status);
              const errorText = await userResponse.text();
              console.error('❌ Middleware: Error response:', errorText);
            }
          } catch (error) {
            console.error('Error checking user payment status:', error);
            // В случае ошибки не делаем редирект для главной страницы
            if (isPaidOnlyPage) {
              const url = req.nextUrl.clone();
              url.pathname = '/';
              return NextResponse.redirect(url, { status: 302 });
            }
          }
        }

        response.cookies.set('Bearer', cookies.Bearer, {
          maxAge: 180 * 24 * 60 * 60,
        });
        
        if (cookies.userId) {
          response.cookies.set('userId', cookies.userId, {
            maxAge: 180 * 24 * 60 * 60,
          });
        }
      }
    } catch (err) {
      //@ts-expect-error
      console.log('TOKEN error - injection attempt', err.message);
      response.cookies.delete('Bearer');
      response.cookies.delete('userId');
    }
  } else if (isPaidOnlyPage) {
    // Если нет токена и пытаемся получить доступ к защищенной странице
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, { status: 302 });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
