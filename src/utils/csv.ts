import { BigNumber } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { Split } from 'models/splits'
import { PayoutMod, TicketMod } from 'models/v1/mods'
import { splitPercentFrom } from 'utils/v2v3/math'
import { percentToPermyriad } from './format/formatNumber'

export function downloadCsvFile(
  filename: string,
  rows: (string | undefined)[][],
) {
  const csvContent =
    'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)

  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${filename}.csv`)

  document.body.appendChild(link)

  link.click()
}

const parseBoolean = (rawBoolean: string): boolean => {
  try {
    return JSON.parse(rawBoolean)
  } catch (e) {
    return false
  }
}

/**
 * Parse a CSV file containing JB Splits.
 * @param csvContent - raw CSV content, including a header row.
 * @returns array of Split objects
 */
export const parseV2SplitsCsv = (csvContent: string): Split[] => {
  // Skip the header row (the first row in the CSV file).
  const [, ...rows] = csvContent.split('\n')

  const splits: Split[] = rows.map(row => {
    const [
      beneficiary,
      percent,
      preferClaimed,
      lockedUntil,
      projectId,
      allocator,
    ] = row.split(',')

    return {
      beneficiary: beneficiary ? getAddress(beneficiary) : undefined,
      percent: splitPercentFrom(parseFloat(percent) * 100).toNumber(),
      preferClaimed: Boolean(preferClaimed),
      lockedUntil: lockedUntil ? parseInt(lockedUntil) : undefined,
      projectId: projectId?.trim() || undefined,
      allocator: allocator ? getAddress(allocator.trim()) : undefined,
    }
  })

  return splits
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
