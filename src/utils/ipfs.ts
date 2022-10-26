import {
  OPEN_IPFS_GATEWAY_HOSTNAME,
  RESTRICTED_IPFS_GATEWAY_HOSTNAME,
} from 'constants/ipfs'
import { base58 } from 'ethers/lib/utils'

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
export function ipfsUrl(cid: string) {
  return `ipfs://${cid}`
}

export const cidFromUrl = (url: string) => url.split('/').pop()

/**
 * Returns a native IPFS link (`ipfs://`) as a https link.
 */
export function ipfsToHttps(ipfsUri: string): string {
  const cid = cidFromUrl(ipfsUri)

  return publicIpfsUrl(cid)
}

// How IPFS URI's are stored in the contracts to save storage (/gas)
export function encodeIPFSUri(cid: string) {
  return '0x' + Buffer.from(base58.decode(cid).slice(2)).toString('hex')
}

export function decodeEncodedIPFSUri(hex: string) {
  // Add default ipfs values for first 2 bytes:
  // - function:0x12=sha2, size:0x20=256 bits
  // - also cut off leading "0x"
  const hashHex = '1220' + hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = base58.encode(hashBytes)
  return hashStr
}
