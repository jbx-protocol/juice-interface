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
    projectId,
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
    projectId,
    allocator,
  }
}
