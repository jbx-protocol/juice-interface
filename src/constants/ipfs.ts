// This is an open gateway. It exposes any ipfs content, not just the content we pin.
// Use when fetching public content (like images).
export const OPEN_IPFS_GATEWAY_HOSTNAME =
  process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME

// Gets strings that start with 'ipfs'
export const IPFS_LINK_REGEX = new RegExp(
  /((?:ipfs?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
)
