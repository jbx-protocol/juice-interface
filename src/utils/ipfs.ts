import {
  OPEN_IPFS_GATEWAY_HOSTNAME,
  RESTRICTED_IPFS_GATEWAY_HOSTNAME,
} from 'constants/ipfs'
import { base58 } from 'ethers/lib/utils'

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/

/**
 * Return a HTTP URL to the IPFS gateway at the given [hostname] for the given [cid].
 */
const ipfsGatewayUrl = (cid: string | undefined = '', hostname: string) => {
  return `https://${hostname}/ipfs/${cid}`
}

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

/**
 * Return a URL to the public (open) IPFS gateway for the given cid.
 */
export const publicIpfsUrl = (cid: string | undefined): string => {
  return ipfsGatewayUrl(cid, OPEN_IPFS_GATEWAY_HOSTNAME)
}

/**
 * Return a URL to the restricted IPFS gateway for the given cid.
 */
export const restrictedIpfsUrl = (cid: string | undefined): string => {
  return ipfsGatewayUrl(cid, RESTRICTED_IPFS_GATEWAY_HOSTNAME)
}

/**
 * Return an IPFS URI using the IPFS URI scheme.
 */
export function ipfsUrl(cid: string, path?: string) {
  return `ipfs://${cid}${path ?? ''}`
}

/**
 * Return the IPFS CID from a given [url].
 *
 * Assumes that the last path segment is the CID.
 * @todo this isn't a great assumption. We should make this more robust, perhaps using a regex.
 */
export const cidFromUrl = (url: string) => url.split('/').pop()

/**
 * Returns a native IPFS link (`ipfs://`) as a https link.
 */
export function ipfsToHttps(ipfsUri: string): string {
  const suffix = ipfsUri.match(IPFS_URL_REGEX)?.[1]
  return publicIpfsUrl(suffix)
}

/**
 * Return a hex-encoded CID to store on-chain.
 *
 * Hex-encoded CIDs are used to store some CIDs on-chain because they are more gas-efficient.
 */
export function encodeIPFSUri(cid: string) {
  return '0x' + Buffer.from(base58.decode(cid).slice(2)).toString('hex')
}

/**
 * Return the IPFS CID from a given hex-endoded string.
 *
 * Hex-encoded CIDs are used to store some CIDs on-chain because they are more gas-efficient.
 */
export function decodeEncodedIPFSUri(hex: string) {
  // Add default ipfs values for first 2 bytes:
  // - function:0x12=sha2, size:0x20=256 bits
  // - also cut off leading "0x"
  const hashHex = '1220' + hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = base58.encode(hashBytes)
  return hashStr
}

// Determines if a string is a valid IPFS url.
export function isIpfsUrl(url: string) {
  return url.startsWith('ipfs://')
}
