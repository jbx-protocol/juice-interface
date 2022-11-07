import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'

const ARCX_API_KEY = process.env.NEXT_PUBLIC_ARCX_API_KEY

let client: ArcxAnalyticsSdk

export async function getArcxClient() {
  // only load arcx in prod
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  if (!ARCX_API_KEY) {
    console.warn('ARCX_API_KEY environment variable not set.')
    return
  }

  if (client) return client

  client = await ArcxAnalyticsSdk.init(ARCX_API_KEY, {
    trackPages: true, // default - automatically trigger PAGE event if the url changes after click
    cacheIdentity: true, // default - caches identity of users in their browser's local storage
  })

  return client
}
