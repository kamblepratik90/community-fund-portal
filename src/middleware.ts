import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // {"sourcePage":"/middleware","nextauth":{"token":{"name":"Admin","email":"admin@community.org","sub":"cmh7gea1b0003vfa4jf0ozzmj","role":"ADMIN","id":"cmh7gea1b0003vfa4jf0ozzmj","iat":1761473506,"exp":1764065506,"jti":"01c5e7c2-eaec-4810-83dc-99b873d409e2"}}}

    // console.log('Middleware - Path:', path, 'req', JSON.stringify(req));
    // Redirect authenticated users away from auth pages
    if (path.startsWith('/login') || path.startsWith('/signup')) {
      if (token) {
        // Redirect to appropriate dashboard based on role
        if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // Check admin routes
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        
        // Public paths that don't require authentication
        if (path === '/' || path.startsWith('/login') || path.startsWith('/signup')) {
          return true;
        }
        
        // All other paths require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};