export type NftRewardTier = {
  contributionFloor: number // ETH amount
  maxSupply: number
  imageUrl: string // link to ipfs
  name: string
  externalLink: string | undefined
  description: string | undefined
}
