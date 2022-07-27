import { NextRequest, NextResponse } from 'next/server'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'

export async function middleware(request: NextRequest) {
  // If request is for a handle id, add the search param with `isHandle`.
  if (request.nextUrl.pathname.startsWith('/@')) {
    const handle = request.nextUrl.pathname.slice(2) // slice off "/@"
    console.info('Project middleware request', {
      pathname: request.nextUrl.pathname,
      handle,
    })
    let projects
    try {
      projects = await paginateDepleteProjectsQueryCall({
        variables: {
          where: { cv: '2', handle },
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
    url.pathname = `/v2/p/${projectId}`
    console.info('Rewriting to project route', {
      originalPathname: request.nextUrl.pathname,
      newPathname: url.pathname,
      handle,
    })
    return NextResponse.rewrite(url)
  }
}
