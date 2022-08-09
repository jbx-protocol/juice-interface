import { BigNumber } from '@ethersproject/bignumber'
import { VeNftVariant } from 'models/v2/veNft'

export interface VeNftToken {
  tokenId: number
  tokenUri: string
  createdAt: number
  unlockedAt?: number
  redeemedAt?: number
  owner: string
  lockAmount: BigNumber
  lockEnd: number
  lockDuration: number
  lockUseJbToken: boolean
  lockAllowPublicExtension: boolean
  variant?: VeNftVariant
}

export type VeNftTokenJson = Record<keyof VeNftToken, string>

export const parseVeNftTokenJson = (
  j: VeNftTokenJson,
): Partial<VeNftToken> => ({
  tokenId: parseInt(j.tokenId),
  tokenUri: j.tokenUri,
  createdAt: parseInt(j.createdAt),
  unlockedAt: j.unlockedAt ? parseInt(j.unlockedAt) : undefined,
  redeemedAt: j.redeemedAt ? parseInt(j.redeemedAt) : undefined,
  owner: j.owner,
  lockAmount: BigNumber.from(j.lockAmount),
  lockEnd: parseInt(j.lockEnd),
  lockDuration: parseInt(j.lockDuration),
  lockUseJbToken: j.lockUseJbToken === 'true',
  lockAllowPublicExtension: j.lockAllowPublicExtension === 'true',
})
