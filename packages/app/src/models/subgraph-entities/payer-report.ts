import { BigNumber } from 'ethers'

export type PayerReport = Partial<{
  id: string
  payer: string
  totalPaid: BigNumber
  project: BigNumber
  lastPaidTimestamp: number
}>

export type PayerReportJson = Partial<Record<keyof PayerReport, string>>

export const parsePayerReportJson = (
  json: PayerReportJson,
): Partial<PayerReport> => ({
  ...json,
  totalPaid: json.totalPaid ? BigNumber.from(json.totalPaid) : undefined,
  project: json.project ? BigNumber.from(json.project) : undefined,
  lastPaidTimestamp: json.lastPaidTimestamp
    ? parseInt(json.lastPaidTimestamp)
    : undefined,
})
