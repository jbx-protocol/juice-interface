import { BigNumber } from '@ethersproject/bignumber'

// How we store reward tiers for use around the app
export type NftRewardTier = {
  contributionFloor: number // ETH amount
  maxSupply: number | undefined
  imageUrl: string // link to ipfs
  name: string
  externalLink: string | undefined
  description: string | undefined
}

// How the reward tiers are stored in the contracts
export type ContractNftRewardTier = {
  contributionFloor: BigNumber //uint128
  remainingQuantity: BigNumber //uint64
  initialQuantity: BigNumber //uint64
  tokenUri: string // full link to IPFS
  votingUnits: BigNumber
  reservedRate: BigNumber
}

// How the reward tiers are stored on IPFS
// Tank - the following are guidelines on NFT keys and tier JSON, derivates from EIP-721, https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
export type IPFSNftRewardTier = {
  attributes: {
    contributionFloor: number
    maxSupply: number | undefined
  }
  name: string
  symbol: string | undefined
  description: string | undefined
  image: string // same as imageUrl
  imageDataUrl: string | undefined // image_data (Raw SVG image data, if you want to generate images on the fly (not recommended). Only use this if you're not including the image parameter.)
  artifactUri: string | undefined // artifactUri (optional, some legacy UX, wallets use this)
  animationUri: string | undefined // animation_uri (Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.)
  displayUri: string | undefined // displayUri (optional, some legacy UX, wallets use this)
  externalLink: string | undefined // external_uri (optional, This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.)
  youtubeUri: string | undefined // youtube_uri (optional, A URL to a YouTube video.)
  backgroundColor: string | undefined // background_color, (optional, Background color of the item on OpenSea. Must be a six-character hexadecimal without a pre-pended #.)
}
