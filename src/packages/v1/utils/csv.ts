import { BigNumber } from 'ethers'
import { percentToPermyriad } from 'utils/format/formatNumber'
import { PayoutMod, TicketMod } from '../models/mods'

const parseBoolean = (rawBoolean: string): boolean => {
  try {
    return JSON.parse(rawBoolean)
  } catch (e) {
    return false
  }
}

export const parseV1PayoutModsCsv = (csvContent: string): PayoutMod[] => {
  const [, ...rows] = csvContent.split('\n')

  const payoutMods: PayoutMod[] = rows.map(row => {
    const [
      beneficiary,
      percent,
      preferUnstaked,
      lockedUntil,
      projectId,
      allocator,
    ] = row.split(',')

    const payoutMod: PayoutMod = {
      beneficiary,
      percent: percentToPermyriad(parseFloat(percent) * 100).toNumber(),
      preferUnstaked: parseBoolean(preferUnstaked),
      lockedUntil: lockedUntil ? parseInt(lockedUntil) : undefined,
      projectId: projectId ? BigNumber.from(projectId) : undefined,
      allocator,
    }

    return payoutMod
  })

  return payoutMods
}

export const parseV1TicketModsCsv = (csvContent: string): TicketMod[] => {
  const [, ...rows] = csvContent.split('\n')

  const ticketMods: TicketMod[] = rows.map(row => {
    const [beneficiary, percent, preferUnstaked, lockedUntil] = row.split(',')

    return {
      preferUnstaked: Boolean(preferUnstaked),
      percent: percentToPermyriad(parseFloat(percent) * 100).toNumber(),
      lockedUntil: lockedUntil ? parseInt(lockedUntil) : undefined,
      beneficiary: beneficiary || undefined,
    }
  })

  return ticketMods
}
