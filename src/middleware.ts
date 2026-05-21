import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Let everything through — auth is handled in each page component
  // Pages redirect to /login themselves if user is not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
