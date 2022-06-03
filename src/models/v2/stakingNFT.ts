export type StakingNFT = {
  name: string
  id: number
  tokensStakedMin: number
  tokensStakedMax?: number
}

export type StakingNFTVariation = {
  lockDuration: number
  variationImage: string
}

export type OwnedStakingNFT = {
  nft: StakingNFTVariation
  owner: string
}
