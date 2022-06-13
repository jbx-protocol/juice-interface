export type NFTRewardTier = {
  criteria: number // might be better as BigNumber of wei, TODO: check with Tank
  NFT: string // link to ipfs
  name: string
  externalLink: string
  description: string
}
