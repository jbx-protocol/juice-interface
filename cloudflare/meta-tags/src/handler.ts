import { utils } from 'ethers'
import { querySubgraph } from './graph'
import { fetchProjectMetadata, ProjectMetadata } from './ipfs'
import { rewriteMetaTags } from './rewrite-meta'

/**
 * Cache time in seconds for resources that
 * we're fetching
 */
const CACHE_TTL = 60 //seconds

/**
 * URL that's being requested.
 */
const VISITING_URL = 'https://juicebox.money'

/**
 * URL where we're fetching the app from.
 */
const ORIGIN_URL = 'https://juicebox.fleek.co'

function isAssetRoute(url: string): boolean {
  return (
    url.includes('/assets/') ||
    url.includes('/static/') ||
    url.includes('/robots.txt')
  )
}

function isProjectRoute(url: string): boolean {
  return url.includes(VISITING_URL + '/p/')
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
  // Routes: Assets (like images, css, robots)
  if (isAssetRoute(request.url)) {
    // Let urls pass through
    const fetchUrl = request.url.replace(VISITING_URL, ORIGIN_URL)
    return await fetchWithCache(fetchUrl)
  }

  // Routes: Projects (/p/*)
  if (isProjectRoute(request.url)) {
    const res = await fetchWithCache(ORIGIN_URL)

    // Parse handle from url
    const handle = request.url.replace(VISITING_URL + '/p/', '')

    // Get metadata
    const metadata = await getMetadata(handle)

    if (metadata) {
      // Add metatags
      return rewriteMetaTags(res, {
        title: metadata.name ?? '',
        description: metadata.description ?? '',
        url: request.url,
        imageUrl: metadata.logoUri,
      })
    }
  }

  // All other routes
  return await fetchWithCache(ORIGIN_URL)
}
