import { CV_V2, CV_V3 } from 'constants/cv'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo'
import { NextRequest, NextResponse } from 'next/server'

// get the handle name from a URL path
const HANDLE_REGEX = new RegExp(/\/@([^/]+).*/)

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/@')) return

  // If request is for a handle id, add the search param with `isHandle`.
  const handle = request.nextUrl.pathname.match(HANDLE_REGEX)?.[1]
  if (!handle) return

  const trailingPath = request.nextUrl.pathname.split('/').slice(2).join('/')

  console.info('Project middleware request', {
    pathname: request.nextUrl.pathname,
    handle,
  })

  let projects
  try {
    projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { cv_in: [CV_V2, CV_V3], handle },
      },
    })
  } catch (e) {
    console.error('Failed to query projects', e)
    throw e
  }

  const url = request.nextUrl

  if (!projects.length) {
    console.info('Page not found', {
      originalPathname: request.nextUrl.pathname,
      newPathname: '/404',
      handle,
    })
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  const projectId = projects[0].projectId
  url.pathname = `/v2/p/${projectId}${trailingPath ? `/${trailingPath}` : ''}`

  console.info('Rewriting to project route', {
    originalPathname: request.nextUrl.pathname,
    newPathname: url.pathname,
    handle,
  })
  return NextResponse.rewrite(url)
}
