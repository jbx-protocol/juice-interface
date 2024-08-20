import { getAddress } from 'viem'
import { Split } from '../models/splits'
import { splitPercentFrom } from './math'

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

  if (splits.some(split => split.percent === 0)) {
    throw new Error('CSV contains splits with 0% percent.')
  }

  // find duplicates
  const duplicateBeneficiaries = splits
    .map(split => split.beneficiary)
    .filter((beneficiary, index, self) => self.indexOf(beneficiary) !== index)
  if (duplicateBeneficiaries.length > 0) {
    throw new Error(
      `CSV contains multiple splits for the same beneficiary: ${duplicateBeneficiaries.join(
        ', ',
      )}`,
    )
  }

  return splits
}
