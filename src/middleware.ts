import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuthMiddleware } from './middleware/admin-auth';

export async function middleware(request: NextRequest) {
	// Handle admin routes with enhanced security
	if (request.nextUrl.pathname.startsWith('/admin')) {
		return adminAuthMiddleware(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
