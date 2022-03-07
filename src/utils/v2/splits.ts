import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { PayoutMod } from 'models/mods'
import { Split } from 'models/v2/splits'

export const toSplit = (mod: PayoutMod): Split => {
  const {
    beneficiary,
    percent,
    preferUnstaked,
    lockedUntil,
    projectId,
    allocator,
  } = mod

  return {
    beneficiary,
    percent,
    lockedUntil,
    projectId: projectId?.toString(),
    allocator,
    preferClaimed: preferUnstaked,
  }
}

export const toMod = (split: Split): PayoutMod => {
  const {
    beneficiary,
    percent,
    preferClaimed,
    lockedUntil,
    projectId,
    allocator,
  } = split

  return {
    beneficiary,
    percent,
    preferUnstaked: preferClaimed,
    lockedUntil,
    projectId: projectId ? BigNumber.from(projectId) : undefined,
    allocator,
  }
}

export const sanitizeSplit = (split: Split): Split => {
  return {
    preferClaimed: false,
    percent: split.percent,
    lockedUntil: split.lockedUntil ?? 0,
    beneficiary: split.beneficiary ?? constants.AddressZero,
    projectId: split.projectId ?? BigNumber.from(0).toHexString(),
    allocator: constants.AddressZero,
  }
}
