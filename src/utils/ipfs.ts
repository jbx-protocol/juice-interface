import {
  OPEN_IPFS_GATEWAY_HOSTNAME,
  RESTRICTED_IPFS_GATEWAY_HOSTNAME,
} from 'constants/ipfs'
import { base58 } from 'ethers/lib/utils'

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/

/**
 * Return a HTTP URL to the IPFS gateway at the given [hostname] for the given [cid].
 */
export const ipfsGatewayUrl = (
  cid: string | undefined = '',
  hostname: string,
) => {
  return `https://${hostname}/ipfs/${cid}`
}

/**
 * Return a URL to our open IPFS gateway for the given cid USING INFURA.
 *
 * The 'open' gateway returns any content that is available on IPFS,
 * not just the content we have pinned.
 *
 * Its use is origin-restriced.
 */
export const ipfsOpenGatewayUrl = (cid: string | undefined): string => {
  return ipfsGatewayUrl(cid, OPEN_IPFS_GATEWAY_HOSTNAME)
}

/**
 * Return a URL to the restricted IPFS gateway for the given cid ON PINATA.
 *
 * The 'restricted' gateway only returns content that we have pinned.
 *
 * @deprecated use ipfsOpenGatewayUrl instead
 */
export const ipfsRestrictedGatewayUrl = (cid: string | undefined): string => {
  return ipfsGatewayUrl(cid, RESTRICTED_IPFS_GATEWAY_HOSTNAME)
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
export function ipfsUriToGatewayUrl(
  ipfsUri: string,
  { gatewayHostname }: { gatewayHostname?: string } = {},
): string {
  if (!isIpfsUri(ipfsUri)) return ipfsUri

  const suffix = cidFromIpfsUri(ipfsUri)
  return gatewayHostname
    ? ipfsGatewayUrl(suffix, gatewayHostname)
    : ipfsOpenGatewayUrl(suffix)
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
