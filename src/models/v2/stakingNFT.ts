import { BigNumber } from '@ethersproject/bignumber'

export type VeNftCharacter = {
  name: string
  image: string
  tokensStakedMin: number
  tokensStakedMax?: number
}

export type VeNftToken = {
  tokenId: number
  ownerAddress: string
  veNftMetadata: VeNftMetadata
  lockInfo: VeNftLockInfo
  character: VeNftCharacter
}

export type VeNftLockInfo = {
  amount: BigNumber
  end: number
  duration: number
  useJbToken: boolean
  allowPublicExtension: boolean
}

export type VeNftAttribute = {
  trait_type: string
  display_type?: string
  value: number | string
}

export type VeNftMetadata = {
  identifier: number
  edition: number
  isBooleanAmount: boolean
  name: string
  attributes: VeNftAttribute[]
  symbol: string
  shouldPreferSymbol: boolean
  description: string
  minter: string
  decimals: number
  creators: string[]
  publishers: string[]
  genre: string[]
  date: string
  tags: string[]
  image: string
  thumbnailUri: string
  animation_url: string
}

// OLD

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

export type LockInfo = {
  amount: BigNumber
  end: number
  duration: number
  useJbToken: boolean
  allowPublicExtension: boolean
}
