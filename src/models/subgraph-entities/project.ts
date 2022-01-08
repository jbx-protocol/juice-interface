import { BigNumber } from '@ethersproject/bignumber'
import { readNetwork } from 'constants/networks'
import { utils } from 'ethers'
import { NetworkName } from 'models/network-name'
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
  handle:
    readNetwork.name === NetworkName.mainnet && project.handle
      ? utils.parseBytes32String(project.handle) // Temporarily handle difference between mainnet subgraph (Bytes32 handle) and testnet (string handle)
      : project.handle,
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
