import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // If request is for a handle id, add the search param with `isHandle`.
  if (request.nextUrl.pathname.startsWith('/@')) {
    const url = request.nextUrl
    url.searchParams.set('isHandle', 'true')
    return NextResponse.rewrite(url)
  }
}
