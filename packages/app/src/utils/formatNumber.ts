import { BigNumber } from '@ethersproject/bignumber'

export const toUint256 = (num: BigNumber) =>
  '0x' + (num?.toHexString().split('x')[1] ?? '').padStart(64, '0')
