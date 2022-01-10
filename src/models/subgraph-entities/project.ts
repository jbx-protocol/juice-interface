import { BigNumber } from '@ethersproject/bignumber'
import { parseParticipantJson } from 'models/subgraph-entities/participant'

import { Participant } from './participant'

export interface Project {
  terminal?: string
  createdAt?: number
  handle?: string
  id?: BigNumber
  creator: string
  uri: string
  currentBalance?: BigNumber
  totalPaid?: BigNumber
  totalRedeemed?: BigNumber
  participants?: Participant[]
  holdersCount?: BigNumber
}

export type ProjectJson = Record<keyof Project, string> & {
  participants: string[]
}

export const parseProjectJson = (project: ProjectJson): Project => ({
  ...project,
  id: project.id ? BigNumber.from(project.id) : undefined,
  createdAt: project.createdAt ? parseInt(project.createdAt) : undefined,
  currentBalance: project.currentBalance
    ? BigNumber.from(project.currentBalance)
    : undefined,
  totalPaid: project.totalPaid ? BigNumber.from(project.totalPaid) : undefined,
  totalRedeemed: project.totalRedeemed
    ? BigNumber.from(project.totalRedeemed)
    : undefined,
  participants:
    project.participants?.map(p => parseParticipantJson(JSON.parse(p))) ?? [],
  holdersCount: project.holdersCount
    ? BigNumber.from(project.holdersCount)
    : undefined,
})
