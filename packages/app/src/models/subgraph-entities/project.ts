import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'

import { PayerReport } from './payer-report'

export type Project = {
  createdAt: number
  handle: string
  id: BigNumber
  creator: string
  uri: string
  currentBalance: BigNumber
  totalPaid: BigNumber
  totalRedeemed: BigNumber
  payers: Partial<PayerReport>[]
}

export type ProjectJson = Record<keyof Project, string> & {
  payers: string[]
}

export const parseProjectJson = (project: ProjectJson): Project => ({
  ...project,
  id: BigNumber.from(project.id),
  createdAt: parseInt(project.createdAt),
  handle: utils.parseBytes32String(project.handle),
  currentBalance: BigNumber.from(project.currentBalance),
  totalPaid: BigNumber.from(project.totalPaid),
  totalRedeemed: BigNumber.from(project.totalRedeemed),
  payers:
    project.payers?.map(p => {
      const payer: Record<keyof PayerReport, string> = JSON.parse(p)
      return {
        ...payer,
        totalPaid: BigNumber.from(payer.totalPaid),
        project: BigNumber.from(payer.project),
        lastPaidTimestamp: parseInt(payer.lastPaidTimestamp),
      }
    }) ?? [],
})
