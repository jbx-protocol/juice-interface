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

export const parseProjectJson = (project: ProjectJson): Partial<Project> => ({
  ...project,
  id: project.id ? BigNumber.from(project.id) : undefined,
  createdAt: project.createdAt ? parseInt(project.createdAt) : undefined,
  handle: project.handle ? utils.parseBytes32String(project.handle) : undefined,
  currentBalance: project.currentBalance
    ? BigNumber.from(project.currentBalance)
    : undefined,
  totalPaid: project.totalPaid ? BigNumber.from(project.totalPaid) : undefined,
  totalRedeemed: project.totalRedeemed
    ? BigNumber.from(project.totalRedeemed)
    : undefined,
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
