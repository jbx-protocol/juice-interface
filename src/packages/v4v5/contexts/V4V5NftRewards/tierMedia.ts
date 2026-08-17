import axios from 'axios'
import { IPFSNftRewardTier } from 'models/nftRewards'
import {
  cidFromUrl,
  ethSucksGatewayUrl,
  ipfsGatewayUrl,
  pinataGatewayUrl,
} from 'utils/ipfs'

/**
 * The gateways a tier's metadata and media are read from, in order.
 *
 * eth.sucks first (fast, and it serves the subdomain form), then the configured
 * gateway, then Pinata's public one. This used to be three copy-pasted try/catch
 * blocks that all preferred URL shapes which had stopped serving — the eth.sucks
 * path form (410 Gone) and cid.v2ex.pro (no longer resolves).
 */
const TIER_GATEWAY_URLS = [ethSucksGatewayUrl, ipfsGatewayUrl, pinataGatewayUrl]

/** Legacy hosts baked into old tier metadata, whose CIDs we re-point at a live gateway. */
const RETIRED_MEDIA_HOSTS =
  /^https?:\/\/(jbx\.mypinata\.cloud|jbm\.infura-ipfs\.io|cid\.v2ex\.pro|ipfs\.banny\.eth\.sucks|ipfs\.io)\//

export async function fetchTierMetadata(tierCid: string): Promise<IPFSNftRewardTier> {
  let lastError: unknown
  for (const gatewayUrl of TIER_GATEWAY_URLS) {
    try {
      const response = await axios.get(gatewayUrl(tierCid))
      return response.data as IPFSNftRewardTier
    } catch (error) {
      lastError = error
      console.warn(`IPFS gateway failed for CID ${tierCid}`, gatewayUrl(tierCid))
    }
  }
  console.error(`All IPFS gateways failed for CID ${tierCid}`)
  throw lastError
}

/** Re-point media stored on a gateway that has stopped serving. */
export function liveMediaUrl(image: string): string {
  if (!RETIRED_MEDIA_HOSTS.test(image)) return image
  const cid = cidFromUrl(image)
  return cid ? ethSucksGatewayUrl(cid) : image
}

