import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/shared/:path*',
    '/api/workout/:path*',
    '/api/gym-profile',
    '/api/exercises/:path*',
  ],
};
