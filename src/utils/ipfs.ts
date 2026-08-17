import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { base58 } from 'ethers/lib/utils'
import round from 'lodash/round'
import { CID } from 'multiformats'
import { UploadProgressEvent } from 'rc-upload/lib/interface'

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/

/**
 * Return a URL to the configured read gateway for the given cid, or to a
 * specific `hostname` when a caller is walking the fallback list.
 */
export const ipfsGatewayUrl = (
  cid: string | undefined,
  hostname: string = OPEN_IPFS_GATEWAY_HOSTNAME,
): string => {
  return `https://${hostname}/ipfs/${cid}`
}

/**
 * Return a URL to the eth.sucks gateway for the given CID.
 *
 * Subdomain form with a v1 CID, which is what that gateway serves — the path form
 * (`ipfs.banny.eth.sucks/ipfs/<cid>`) answers 410 Gone, so everything routed
 * through it rendered broken.
 */
export const ethSucksGatewayUrl = (cid: string | undefined): string => {
  if (!cid) return ''
  return `https://${convertToV1CID(cid)}.eth.sucks/`
}

/**
 * Return a URL to Pinata gateway for the given CID.
 * Uses the original CID format.
 */
export const pinataGatewayUrl = (cid: string | undefined): string => {
  if (!cid) return ''
  return `https://gateway.pinata.cloud/ipfs/${cid}`
}

/**
 * Return a URL to v2ex.pro gateway for the given CID.
 * Uses the cid.v2ex.pro subdomain format.
 */
export const v2exGatewayUrl = (cid: string | undefined): string => {
  if (!cid) return ''
  return `https://cid.v2ex.pro/ipfs/${cid}`
}

/**
 * Converts IPFS CID v0 to CID v1
 * Example: QmeXh2xA846Pb6NdRUWXtPHG1WFnQ7uk3944Rgq57znzKV -> bafybeihqr4bc32lg74ovmyjfv1mszxhhwtrc2dckiojbskdjcrgr5barq
 */
export const convertToV1CID = (cid: string): string => {
  // If already a v1 CID (starts with 'baf'), return as is
  if (cid.startsWith('baf')) {
    return cid
  }

  try {
    // Parse the CID using multiformats library
    const parsedCid = CID.parse(cid)

    // Convert to v1 and return as string
    return parsedCid.toV1().toString()
  } catch (e) {
    console.error('Failed to convert CID:', e)
    return cid
  }
}

/**
 * Return an IPFS URI using the IPFS URI scheme.
 */
export function ipfsUri(cid: string, path?: string) {
  return `ipfs://${cid}${path ?? ''}`
}

/**
 * Return the IPFS CID from a given [url].
 *
 * Assumes that the last path segment is the CID.
 * @todo this isn't a great assumption. We should make this more robust, perhaps using a regex.
 */
export const cidFromUrl = (url: string) => url.split('/').pop()

export const cidFromIpfsUri = (ipfsUri: string) =>
  ipfsUri.match(IPFS_URL_REGEX)?.[1]

/**
 * Returns a native IPFS link (`ipfs://`) as an https link on a read gateway.
 */
export function ipfsUriToGatewayUrl(ipfsUri: string): string {
  if (!isIpfsUri(ipfsUri)) return ipfsUri

  const cid = cidFromIpfsUri(ipfsUri)
  return cid && isIpfsCID(cid) ? ethSucksGatewayUrl(cid) : ipfsGatewayUrl(cid)
}

/**
 * Convert an `ipfs://` url, or one pointing at the retired dedicated gateway, to
 * the current read gateway.
 */
export function pinataToGatewayUrl(url: string) {
  let cid: string | undefined

  if (url.startsWith('https://jbx.mypinata.cloud')) {
    cid = cidFromUrl(url)
  } else if (url.startsWith('ipfs://')) {
    cid = cidFromIpfsUri(url)
  } else {
    return url
  }

  if (cid && isIpfsCID(cid)) {
    return ethSucksGatewayUrl(cid)
  }

  if (url.startsWith('https://jbx.mypinata.cloud')) {
    return ipfsGatewayUrl(cidFromUrl(url))
  } else if (url.startsWith('ipfs://')) {
    return ipfsUriToGatewayUrl(url)
  }

  return url
}

/**
 * Return a hex-encoded CID to store on-chain.
 *
 * Hex-encoded CIDs are used to store some CIDs on-chain because they are more gas-efficient.
 */
export function encodeIpfsUri(cid: string): `0x${string}` {
  return `0x${Buffer.from(base58.decode(cid).slice(2)).toString('hex')}`
}

/**
 * Return the IPFS CID from a given hex-endoded string.
 *
 * Hex-encoded CIDs are used to store some CIDs on-chain because they are more gas-efficient.
 */
export function decodeEncodedIpfsUri(hex: string) {
  // Add default ipfs values for first 2 bytes:
  // - function:0x12=sha2, size:0x20=256 bits
  // - also cut off leading "0x"
  const hashHex = '1220' + hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = base58.encode(hashBytes)
  return hashStr
}

// Determines if a string is a valid IPFS url.
export function isIpfsUri(url: string) {
  return url.startsWith('ipfs://')
}

export function isIpfsCID(cid: string) {
  return (
    cid.startsWith('Qm') || cid.startsWith('bafy') || cid.startsWith('bafk')
  )
}

export function percentFromUploadProgressEvent(e: UploadProgressEvent) {
  if (typeof e.loaded !== 'number' || typeof e.total !== 'number') return 0

  const percent = (e.loaded / e.total) * 100
  return round(percent, 0)
}

/**
 * Return a URL to a public IPFS gateway for the given cid
 */
export const ipfsPublicGatewayUrl = (cid: string | undefined): string => {
  return `https://ipfs.io/ipfs/${cid}`
}
