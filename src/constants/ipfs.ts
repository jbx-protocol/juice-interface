import { NetworkName } from 'models/network-name'
import { readNetwork } from './networks'

const GOERLI_IPFS_OPEN_GATEWAY = 'jbx-goerli.mypinata.cloud' // restricted to goerli.juicebox.money.
const MAINNET_IPFS_OPEN_GATEWAY = 'jbx-mainnet.mypinata.cloud' // restricted to juicebox.money.
const PINATA_PUBLIC_GATEWAY = 'gateway.pinata.cloud' // heavily rate-limited, shouldn't be used in prod.

const GATEWAYS: {
  [key in NetworkName]?: string
} = {
  [NetworkName.mainnet]: MAINNET_IPFS_OPEN_GATEWAY,
  [NetworkName.goerli]: GOERLI_IPFS_OPEN_GATEWAY,
}

// This is an open gateway. It exposes any ipfs content, not just the content we pin.
// Use when fetching public content (like images).
export const OPEN_IPFS_GATEWAY_HOSTNAME =
  (process.env.NODE_ENV === 'production' && GATEWAYS[readNetwork.name]) ||
  PINATA_PUBLIC_GATEWAY

// This is a restricted gateway. It only exposes content we pin against it.
// Use when pinning content (like project metadata), and for retreiving content we've pinned.
export const RESTRICTED_IPFS_GATEWAY_HOSTNAME = process.env
  .NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME as string

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
