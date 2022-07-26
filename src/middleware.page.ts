import { NextRequest, NextResponse } from 'next/server'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'

export async function middleware(request: NextRequest) {
  // If request is for a handle id, add the search param with `isHandle`.
  if (request.nextUrl.pathname.startsWith('/@')) {
    const handle = request.nextUrl.pathname.slice(2) // slice off "/@"
    const projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { cv: '2', handle },
      },
    })
    const url = request.nextUrl
    if (!projects.length) {
      url.pathname = '/404'
      return NextResponse.rewrite(url)
    }

    const projectId = projects[0].projectId
    url.pathname = `/v2/p/${projectId}`
    return NextResponse.rewrite(url)
  }
}
