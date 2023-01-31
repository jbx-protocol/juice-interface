import { BigNumber } from '@ethersproject/bignumber'
import { VeNftVariant } from 'models/veNft'
import { parseBigNumberKeyVal } from 'utils/graph'

import { Json } from '../../json'

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

export const parseVeNftTokenJson = (
  j: Json<VeNftToken> & { contract?: { address?: string } },
): VeNftToken => ({
  ...j,
  ...(j.contract?.address ? { contractAddress: j.contract.address } : {}),
  ...parseBigNumberKeyVal('lockAmount', j.lockAmount),
})
