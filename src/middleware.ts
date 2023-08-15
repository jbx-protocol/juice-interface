import { getLogger } from 'lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { fetchProjectIdForHandle } from 'pages/api/juicebox/project/[projectHandle]'

// get the handle name from a URL path
const HANDLE_REGEX = new RegExp(/\/@([^/]+).*/)

const logger = getLogger('middleware/page')

export async function middleware(request: NextRequest) {
  logger.info('middleware request', { pathname: request.nextUrl.pathname })
  if (!request.nextUrl.pathname.startsWith('/@')) return

  // If request is for a handle id, add the search param with `isHandle`.
  const handle = request.nextUrl.pathname.match(HANDLE_REGEX)?.[1]
  if (!handle) return

  const handleDecoded = decodeURI(handle)

  const trailingPath = request.nextUrl.pathname.split('/').slice(2).join('/')

  logger.info('resolving handle', {
    pathname: request.nextUrl.pathname,
    handle: handleDecoded,
  })

  let projectId
  try {
    projectId = await fetchProjectIdForHandle(handleDecoded)
  } catch (e) {
    logger.error('Failed to find project id for handle', handleDecoded, e)
    throw e
  }

  const url = request.nextUrl

  if (!projectId) {
    logger.info('Page not found', {
      originalPathname: request.nextUrl.pathname,
      newPathname: '/404',
      handle: handleDecoded,
    })
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  url.pathname = `/v2/p/${projectId}${trailingPath ? `/${trailingPath}` : ''}`

  logger.info('Rewriting to project route', {
    originalPathname: request.nextUrl.pathname,
    newPathname: url.pathname,
    handle: handleDecoded,
  })
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: '/@(.*)',
}
