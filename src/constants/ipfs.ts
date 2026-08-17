// A public gateway serves any IPFS content, not just what we pin, so it is what
// reads go through (images, project metadata).
//
// The default matters: `NEXT_PUBLIC_INFURA_IPFS_HOSTNAME` pointed at a dedicated
// gateway that stopped resolving (`jbx.mypinata.cloud` is NXDOMAIN), which took
// every project page down with it — server-side metadata reads threw, so ISR
// returned 500 for every project that exists.
export const OPEN_IPFS_GATEWAY_HOSTNAME =
  process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME || 'gateway.pinata.cloud'

/**
 * Read gateways, in the order they are tried. The configured one first — when it
 * is a dedicated gateway it is the fastest and least rate-limited — then public
 * fallbacks, so one gateway going away degrades speed instead of the site.
 */
export const IPFS_GATEWAY_HOSTNAMES: string[] = Array.from(
  new Set(
    [
      process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME,
      // Pinata first: this is where the app pins, so it holds the content even
      // when the wider network has not seen it. ipfs.io backs it up.
      'gateway.pinata.cloud',
      'ipfs.io',
    ].filter((hostname): hostname is string => !!hostname),
  ),
)

export const INFURA_IPFS_API_BASE_URL = 'https://ipfs.infura.io:5001'

// Gets strings that start with 'ipfs'
export const IPFS_LINK_REGEX = new RegExp(
  /((?:ipfs?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
)
