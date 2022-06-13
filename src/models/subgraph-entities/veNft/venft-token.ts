import {
  parseVeNftLockInfoJson,
  VeNftLockInfo,
  VeNftLockInfoJson,
} from 'models/subgraph-entities/veNft/venft-lock-info'
import { VeNftVariant } from 'models/veNft/veNftVariant'

export interface VeNftToken {
  tokenId: number
  tokenUri: string
  owner: string
  lockInfo: VeNftLockInfo
  variant?: VeNftVariant
}

export type VeNftTokenJson = Record<keyof VeNftToken, string>

export const parseVeNftTokenJson = (
  j: VeNftTokenJson,
): Partial<VeNftToken> => ({
  tokenId: parseInt(j.tokenId),
  tokenUri: j.tokenUri,
  owner: j.owner,
  lockInfo: parseVeNftLockInfoJson(j.lockInfo as unknown as VeNftLockInfoJson),
})
