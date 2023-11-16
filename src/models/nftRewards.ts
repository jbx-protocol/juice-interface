import { BigNumber } from 'ethers'
import { CurrencyOption } from './currencyOption'

// How we store reward tiers for use around the app
export type NftRewardTier = {
  contributionFloor: number // ETH or USD amount
  fileUrl: string // link to ipfs
  name: string
  id: number
  maxSupply: number | undefined
  remainingSupply: number | undefined
  reservedRate: number | undefined
  beneficiary: string | undefined
  votingWeight: string | undefined
  externalLink: string | undefined
  description: string | undefined
}

export type JBTiered721Flags = {
  lockReservedTokenChanges: boolean
  lockVotingUnitChanges: boolean
  lockManualMintingChanges: boolean
  preventOverspending: boolean
}

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

export type JB_721_TIER_PARAMS_V3_1 = Omit<
  JB721TierParams,
  'shouldUseBeneficiaryAsDefault'
> & {
  royaltyRate: number
  royaltyBeneficiary: string // address
  shouldUseReservedTokenBeneficiaryAsDefault: boolean
  shouldUseRoyaltyBeneficiaryAsDefault: boolean
  category: number // 1
}

export type JB_721_TIER_PARAMS_V3_2 = Omit<
  JB_721_TIER_PARAMS_V3_1,
  | 'royaltyRate'
  | 'royaltyBeneficiary'
  | 'shouldUseRoyaltyBeneficiaryAsDefault'
  | 'contributionFloor'
  | 'lockedUntil'
> & {
  price: BigNumber
  useVotingUnits: boolean
}

// Tiers as they are stored on-chain.
export type JB721TierV3 = JB721TierParams & {
  id: BigNumber
  remainingQuantity?: BigNumber
}

export type JB_721_TIER_V3_2 = Omit<
  JB721TierV3,
  'royaltyRate' | 'royaltyBeneficiary' | 'contributionFloor' | 'lockedUntil'
> & {
  price: BigNumber
  resolvedUri: string
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
  ONCHAIN,
}

export interface JB721PricingParams {
  tiers: (JB721TierParams | JB_721_TIER_PARAMS_V3_1 | JB_721_TIER_PARAMS_V3_2)[]
  currency: CurrencyOption
  decimals: number
  prices: string // address
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

export type JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1 = Omit<
  JBDeployTiered721DelegateData,
  'directory'
>
