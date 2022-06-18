export type NFTRewardTier = {
  paymentThreshold: number // might be better as BigNumber of wei, TODO: check with Tank
  maxSupply: number
  imageUrl: string // link to ipfs
  name: string
  externalLink: string
  description: string
}
