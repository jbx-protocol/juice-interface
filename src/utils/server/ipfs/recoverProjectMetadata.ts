import axios from 'axios'
import { consolidateMetadata, ProjectMetadata } from 'models/projectMetadata'

/**
 * Metadata for early projects was pinned through IPFS services that no longer
 * exist, so the CID stored on-chain can be unresolvable. Every project page was
 * server-rendered with its metadata inlined in `__NEXT_DATA__`, and the Wayback
 * Machine holds snapshots of those pages — so the metadata can be read back out
 * of the last archived render.
 */
const WAYBACK_AVAILABLE_URL = 'https://archive.org/wayback/available'
const TIMEOUT_MS = 15_000

// ponytail: per-instance memo so ISR's short revalidate doesn't hammer archive.org.
// Move to a KV store if instances churn enough that it stops helping.
const recovered = new Map<number, Promise<ProjectMetadata | undefined>>()

export const recoverProjectMetadata = (
  projectId: number,
): Promise<ProjectMetadata | undefined> => {
  let pending = recovered.get(projectId)
  if (!pending) {
    pending = recoverFromWayback(projectId).catch(e => {
      console.error('Wayback metadata recovery failed', {
        projectId,
        error: e?.message,
      })
      recovered.delete(projectId)
      return undefined
    })
    recovered.set(projectId, pending)
  }
  return pending
}

const recoverFromWayback = async (projectId: number) => {
  const pageUrl = `juicebox.money/v2/p/${projectId}`
  const { data: available } = await axios.get<{
    archived_snapshots?: { closest?: { url?: string } }
  }>(WAYBACK_AVAILABLE_URL, { params: { url: pageUrl }, timeout: TIMEOUT_MS })

  const snapshotUrl = available.archived_snapshots?.closest?.url
  if (!snapshotUrl) return undefined

  // `id_` asks for the original response bytes, without the Wayback toolbar.
  const rawUrl = snapshotUrl.replace(/(\/web\/\d+)\//, '$1id_/')
  const { data: html } = await axios.get<string>(rawUrl, {
    timeout: TIMEOUT_MS,
    responseType: 'text',
  })
  return metadataFromPageHtml(html)
}

export const metadataFromPageHtml = (
  html: string,
): ProjectMetadata | undefined => {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s,
  )
  if (!match) return undefined
  const metadata = JSON.parse(match[1])?.props?.pageProps?.metadata
  return metadata ? consolidateMetadata(metadata) : undefined
}
