import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyOption } from './currencyOption'

export const NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX = 0

export type JB721DELEGATE_V1 = '1'
export type JB721DELEGATE_V1_1 = '1.1'

// How we store reward tiers for use around the app
export type NftRewardTier = {
  contributionFloor: number // ETH amount
  maxSupply: number | undefined
  remainingSupply: number | undefined
  fileUrl: string // link to ipfs
  name: string
  id: number
  reservedRate: number | undefined
  beneficiary: string | undefined
  votingWeight: number | undefined
  externalLink: string | undefined
  description: string | undefined
}

export type JBTiered721Flags = {
  lockReservedTokenChanges: boolean
  lockVotingUnitChanges: boolean
  lockManualMintingChanges: boolean
  preventOverspending: boolean
}
export type JB721DelegateVersion = JB721DELEGATE_V1 | JB721DELEGATE_V1_1

// Used when launching or adjusting tiers.
export interface JB721TierParams {
  contributionFloor: BigNumber // uint128
  lockedUntil: BigNumber
  initialQuantity: BigNumber // uint64
  votingUnits: BigNumber
  reservedRate: BigNumber
  reservedTokenBeneficiary: string
  encodedIPFSUri: string // encoded link to the rewardTier on IPFS
  allowManualMint: boolean
  shouldUseBeneficiaryAsDefault: boolean
  transfersPausable: boolean
}

export type JB_721_TIER_PARAMS_V1_1 = Omit<
  JB721TierParams,
  'shouldUseBeneficiaryAsDefault'
> & {
  royaltyRate: number
  royaltyBeneficiary: string // address
  shouldUseReservedTokenBeneficiaryAsDefault: boolean
  shouldUseRoyaltyBeneficiaryAsDefault: boolean
  category: number // 1
}

// Tiers as they are stored on-chain.
export type JB721Tier = JB721TierParams & {
  id: BigNumber
  remainingQuantity?: BigNumber
}

type OpenSeaAttribute = {
  //eslint-disable-next-line
  trait_type: string
  value: number | undefined
}

// How the reward tiers are stored on IPFS
// The following are guidelines on NFT keys and tier JSON, derivates from EIP-721, https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
export type IPFSNftRewardTier = {
  attributes: OpenSeaAttribute[]
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

// Metadata for the whole collection on IPFS
export type IPFSNftCollectionMetadata = {
  name: string
  description: string | undefined
  image: string | undefined
  external_link: string | undefined
  seller_fee_basis_points: number | undefined
  fee_recipient: string | undefined
}

export type NftCollectionMetadata = {
  symbol: string | undefined
  name: string | undefined
  uri?: string
  description: string | undefined
}

export type NftPostPayModalConfig = {
  ctaText: string | undefined
  ctaLink: string | undefined
  content: string | undefined
}

export enum JB721GovernanceType {
  NONE,
  TIERED,
  GLOBAL,
}

export interface JB721PricingParams {
  tiers: JB721TierParams[]
  currency: CurrencyOption
  decimals: number
  prices: string
}

export interface JBDeployTiered721DelegateData {
  directory: string
  name: string
  symbol: string
  fundingCycleStore: string
  baseUri: string
  tokenUriResolver: string
  contractUri: string
  owner: string
  pricing: JB721PricingParams
  reservedTokenBeneficiary: string
  store: string
  flags: JBTiered721Flags
  governanceType: JB721GovernanceType
}
