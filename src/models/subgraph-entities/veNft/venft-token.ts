import { BigNumber } from '@ethersproject/bignumber'
import { VeNftVariant } from 'models/veNft/veNftVariant'

export interface VeNftToken {
  tokenId: number
  tokenUri: string
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
  owner: j.owner,
  lockAmount: BigNumber.from(j.lockAmount),
  lockEnd: parseInt(j.lockEnd),
  lockDuration: parseInt(j.lockDuration),
  lockUseJbToken: j.lockUseJbToken === 'true',
  lockAllowPublicExtension: j.lockAllowPublicExtension === 'true',
})
