import { BigNumber } from '@ethersproject/bignumber'
import {
  parseParticipantJson,
  ParticipantJson,
} from 'models/subgraph-entities/participant'

import {
  DeployedERC20Event,
  DeployedERC20EventJson,
  parseDeployedERC20EventJson,
} from './deployed-erc20-event'

import { Participant } from './participant'
import {
  DistributeToPayoutModEvent,
  DistributeToPayoutModEventJson,
  parseDistributeToPayoutModEvent,
} from './distribute-to-payout-mod-event'
import {
  DistributeToTicketModEvent,
  DistributeToTicketModEventJson,
  parseDistributeToTicketModEvent,
} from './distribute-to-ticket-mod-event'
import { parsePayEventJson, PayEvent, PayEventJson } from './pay-event'
import {
  parsePrintPremineEventJson,
  PrintPremineEvent,
  PrintPremineEventJson,
} from './print-premine-event'
import { parseTapEventJson, TapEvent, TapEventJson } from './tap-event'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from './redeem-event'
import {
  parsePrintReservesEventJson,
  PrintReservesEvent,
  PrintReservesEventJson,
} from './print-reserves-event'

export interface Project {
  id: BigNumber
  handle: string
  creator: string
  createdAt: number
  uri: string
  totalPaid: BigNumber
  totalRedeemed: BigNumber
  currentBalance: BigNumber
  participants: Partial<Participant>[]
  terminal: string
  payEvents: Partial<PayEvent>[]
  printPremineEvents: Partial<PrintPremineEvent>[]
  tapEvents: Partial<TapEvent>[]
  redeemEvents: Partial<RedeemEvent>[]
  printReservesEvents: Partial<PrintReservesEvent>[]
  distributeToPayoutModEvents: Partial<DistributeToPayoutModEvent>[]
  distributeToTicketModEvents: Partial<DistributeToTicketModEvent>[]
  deployedERC20Events: Partial<DeployedERC20Event>[]
}

export type TrendingProject = Project & {
  trendingVolume: BigNumber
  trendingScore: BigNumber
  trendingPaymentsCount: number
}

export type ProjectJson = Partial<
  Record<
    Exclude<
      keyof Project,
      | 'participants'
      | 'printPremineEvents'
      | 'payEvents'
      | 'tapEvents'
      | 'redeemEvents'
      | 'printReservesEvents'
      | 'deployedERC20Events'
      | 'distributeToPayoutModEvents'
      | 'distributeToTicketModEvents'
    >,
    string
  > & {
    participants: ParticipantJson[]
    printPremineEvents: PrintPremineEventJson[]
    payEvents: PayEventJson[]
    tapEvents: TapEventJson[]
    redeemEvents: RedeemEventJson[]
    printReservesEvents: PrintReservesEventJson[]
    deployedERC20Events: DeployedERC20EventJson[]
    distributeToPayoutModEvents: DistributeToPayoutModEventJson[]
    distributeToTicketModEvents: DistributeToTicketModEventJson[]
  }
>

export const parseProjectJson = (project: ProjectJson): Partial<Project> => ({
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
  participants: project.participants?.map(parseParticipantJson) ?? undefined,
  printPremineEvents:
    project.printPremineEvents?.map(parsePrintPremineEventJson) ?? undefined,
  payEvents: project.payEvents?.map(parsePayEventJson) ?? undefined,
  tapEvents: project.tapEvents?.map(parseTapEventJson) ?? undefined,
  redeemEvents: project.redeemEvents?.map(parseRedeemEventJson) ?? undefined,
  printReservesEvents:
    project.printReservesEvents?.map(parsePrintReservesEventJson) ?? undefined,
  deployedERC20Events:
    project.deployedERC20Events?.map(parseDeployedERC20EventJson) ?? undefined,
  distributeToPayoutModEvents:
    project.distributeToPayoutModEvents?.map(parseDistributeToPayoutModEvent) ??
    undefined,
  distributeToTicketModEvents:
    project.distributeToTicketModEvents?.map(parseDistributeToTicketModEvent) ??
    undefined,
})
