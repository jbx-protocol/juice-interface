import { BigNumber } from '@ethersproject/bignumber'

export type VeNftVariant = {
  id: number
  name: string
  tokensStakedMin: number
  tokensStakedMax?: number
}

export type VeNftToken = {
  tokenId: number
  ownerAddress: string
  metadata: VeNftMetadata
  lockInfo: VeNftLockInfo
  variant: VeNftVariant
}

export type VeNftLockInfo = {
  amount: BigNumber
  end: number
  duration: number
  useJbToken: boolean
  allowPublicExtension: boolean
}

export type VeNftMetadata = {
  name: string
  description: string
  minter: string
  image: string
  thumbnailUri: string
  animation_url: string
}
