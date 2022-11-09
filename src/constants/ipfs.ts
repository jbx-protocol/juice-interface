// This is an open gateway. It exposes any ipfs content, not just the content we pin.
// Use when fetching public content (like images).
export const OPEN_IPFS_GATEWAY_HOSTNAME =
  process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME

// This is a restricted gateway. It only exposes content we pin against it.
// Use when pinning content (like project metadata), and for retreiving content we've pinned.
export const RESTRICTED_IPFS_GATEWAY_HOSTNAME =
  process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME

export const INFURA_IPFS_API_BASE_URL = 'https://ipfs.infura.io:5001'

// Heavily rate-limited, don't use unless you have to.
export const PUBLIC_PINATA_GATEWAY_HOSTNAME = 'gateway.pinata.cloud'

export const IPFS_TAGS = {
  METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_metadata'
      : 'DEV_juicebox_project_metadata',
  LOGO:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_logo'
      : 'DEV_juicebox_project_logo',
  NFT_REWARDS:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_nft_reward_tier'
      : 'DEV_juicebox_nft_reward_tier',
  SNAPSHOT_SETTINGS:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_snapshot_settings'
      : 'DEV_juicebox_snapshot_settings',
  NFT_REWARDS_COLLECTION_METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_nft_reward_tier_collection'
      : 'DEV_juicebox_nft_reward_tier_collectionr',
}

// Gets strings that start with 'ipfs'
export const IPFS_LINK_REGEX = new RegExp(
  /((?:ipfs?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
)
