import { BigNumber } from '@ethersproject/bignumber'
import { VeNftVariant } from 'models/v2/veNft'

import { parseVeNftContractJson, VeNftContractJson } from './venft-contract'

export interface VeNftToken {
  contractAddress: string
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

export type VeNftTokenJson = Partial<
  Record<Exclude<keyof VeNftToken, 'tokens'>, string> & {
    contract: VeNftContractJson
  }
>

export const parseVeNftTokenJson = (
  j: VeNftTokenJson,
): Partial<VeNftToken> => ({
  contractAddress: j.contract
    ? parseVeNftContractJson(j.contract).address
    : undefined,
  tokenId: j.tokenId ? parseInt(j.tokenId) : undefined,
  tokenUri: j.tokenUri,
  createdAt: j.createdAt ? parseInt(j.createdAt) : undefined,
  unlockedAt: j.unlockedAt ? parseInt(j.unlockedAt) : undefined,
  redeemedAt: j.redeemedAt ? parseInt(j.redeemedAt) : undefined,
  owner: j.owner,
  lockAmount: BigNumber.from(j.lockAmount),
  lockEnd: j.lockEnd ? parseInt(j.lockEnd) : undefined,
  lockDuration: j.lockDuration ? parseInt(j.lockDuration) : undefined,
  lockUseJbToken: j.lockUseJbToken === 'true',
  lockAllowPublicExtension: j.lockAllowPublicExtension === 'true',
})
