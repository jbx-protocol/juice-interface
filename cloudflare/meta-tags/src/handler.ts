import { utils } from 'ethers'
import { querySubgraph } from './graph'
import { fetchProjectMetadata, ProjectMetadata } from './ipfs'
import {
  withCloudflareMeta,
  withOGBasicMeta,
  withOGImageUrlMeta,
} from './html-rewriter'

/**
 * Cache time in seconds for resources that
 * we're fetching
 */
const CACHE_TTL = 60 //seconds

function isAssetRoute(url: string): boolean {
  return (
    url.includes('/assets/') ||
    url.includes('/static/') ||
    url.includes('/robots.txt')
  )
}

function isProjectRoute(url: string): boolean {
  return url.includes('/p/')
}

async function fetchWithCache(url: string) {
  return await fetch(url, {
    cf: {
      cacheTtl: CACHE_TTL,
    },
  })
}

async function getMetadata(
  handle: string,
): Promise<ProjectMetadata | undefined> {
  const data = await querySubgraph({
    entity: 'project',
    keys: ['uri'],
    where: {
      key: 'handle',
      value: utils.formatBytes32String(handle),
    },
  })
  const uri = data?.projects[0]?.uri
  if (uri) {
    return await fetchProjectMetadata(uri)
  }
}

export async function handleRequest(request: Request): Promise<Response> {
  const visitingUrl = new URL(request.url).origin
  // Routes: Assets (like images, css, robots)
  if (isAssetRoute(request.url)) {
    // Let urls pass through
    const fetchUrl = request.url.replace(visitingUrl, ORIGIN_URL)
    return await fetchWithCache(fetchUrl)
  }

  let rewriter = new HTMLRewriter()
  rewriter = withCloudflareMeta()(rewriter)

  const res = await fetchWithCache(ORIGIN_URL)

  // Routes: Projects (/p/*)
  if (isProjectRoute(request.url)) {
    // Parse handle from url
    const handle = request.url.replace(visitingUrl + '/p/', '')

    // Get metadata
    const metadata = await getMetadata(handle)

    if (metadata) {
      rewriter = withOGBasicMeta({
        title: metadata.name ?? '',
        description: metadata.description ?? '',
        url: request.url,
      })(rewriter)
      if (metadata.logoUri) {
        rewriter = withOGImageUrlMeta({ imageUrl: metadata.logoUri })(rewriter)
      }
    }
  }

  // All other routes
  return rewriter.transform(res)
}
