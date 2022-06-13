import { BigNumber } from '@ethersproject/bignumber'

export interface VeNftLockInfo {
  amount: BigNumber
  end: number
  duration: number
  useJbToken: boolean
  allowPublicExtension: boolean
}

export type VeNftLockInfoJson = Record<keyof VeNftLockInfo, string>

export const parseVeNftLockInfoJson = (
  j: VeNftLockInfoJson,
): VeNftLockInfo => ({
  amount: BigNumber.from(j.amount),
  end: parseInt(j.end),
  duration: parseInt(j.duration),
  useJbToken: j.useJbToken === 'true',
  allowPublicExtension: j.allowPublicExtension === 'true',
})
