import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { base58 } from 'ethers/lib/utils'
import round from 'lodash/round'
import { UploadProgressEvent } from 'rc-upload/lib/interface'

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/

/**
 * Return a URL to our open IPFS gateway for the given cid USING INFURA.
 *
 * The 'open' gateway returns any content that is available on IPFS,
 * not just the content we have pinned.
 */
export const ipfsGatewayUrl = (cid: string | undefined): string => {
  return `https://${OPEN_IPFS_GATEWAY_HOSTNAME}/ipfs/${cid}`
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
 * Returns a native IPFS link (`ipfs://`) as a https link.
 */
export function ipfsUriToGatewayUrl(ipfsUri: string): string {
  if (!isIpfsUri(ipfsUri)) return ipfsUri

  const suffix = cidFromIpfsUri(ipfsUri)
  return ipfsGatewayUrl(suffix)
}

/**
 * Convert `ipfs://` urls or urls using old gateway to a url using the new gateway.
 * e.g.- ipfs://123 -> https://new-gateway.io/ipfs/123
 *     - https://old-gateway.io/ipfs/123 -> https://new-gateway.io/ipfs/123
 */
export function pinataToGatewayUrl(url: string) {
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
export function encodeIpfsUri(cid: string) {
  return '0x' + Buffer.from(base58.decode(cid).slice(2)).toString('hex')
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
