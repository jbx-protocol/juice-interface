import { Contract } from '@ethersproject/contracts'

export type VeNftVariant = {
  id: number
  name: string
  tokensStakedMin: number
  tokensStakedMax?: number
  imageUrl?: string
}

export type VeNftTokenMetadata = {
  thumbnailUri: string
}

export enum VeNftContractName {
  JBVeNft = 'JBVeNft',
  JBVeNftDeployer = 'JBVeNftDeployer',
  JBVeTokenUriResolver = 'JBVeTokenUriResolver',
}

export type VeNftContracts = Record<VeNftContractName, Contract>
