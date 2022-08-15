import { BigNumber } from '@ethersproject/bignumber'
import {
  parseParticipantJson,
  ParticipantJson,
} from 'models/subgraph-entities/vX/participant'

import { CV } from '../../cv'
import {
  DeployedERC20Event,
  DeployedERC20EventJson,
  parseDeployedERC20EventJson,
} from './deployed-erc20-event'
import {
  DistributeToPayoutModEvent,
  DistributeToPayoutModEventJson,
  parseDistributeToPayoutModEvent,
} from '../v1/distribute-to-payout-mod-event'
import {
  DistributeToTicketModEvent,
  DistributeToTicketModEventJson,
  parseDistributeToTicketModEvent,
} from '../v1/distribute-to-ticket-mod-event'
import { Participant } from './participant'
import { parsePayEventJson, PayEvent, PayEventJson } from './pay-event'
import {
  parseMintTokensEventJson,
  MintTokensEvent,
  MintTokensEventJson,
} from './mint-tokens-event'
import {
  parsePrintReservesEventJson,
  PrintReservesEvent,
  PrintReservesEventJson,
} from '../v1/print-reserves-event'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from './redeem-event'
import { parseTapEventJson, TapEvent, TapEventJson } from '../v1/tap-event'
import {
  parseVeNftContractJson,
  VeNftContract,
  VeNftContractJson,
} from '../v2/venft-contract'

type BaseProject = {
  id: string
  projectId: number
  cv: CV
  owner: string
  createdAt: number
  trendingPaymentsCount: number
  trendingScore: BigNumber
  trendingVolume: BigNumber
  createdWithinTrendingWindow: boolean
  totalPaid: BigNumber
  totalRedeemed: BigNumber
  currentBalance: BigNumber
  participants: Partial<Participant>[]
  payEvents: Partial<PayEvent>[]
  printPremineEvents: Partial<MintTokensEvent>[]
  tapEvents: Partial<TapEvent>[]
  redeemEvents: Partial<RedeemEvent>[]
  printReservesEvents: Partial<PrintReservesEvent>[]
  distributeToPayoutModEvents: Partial<DistributeToPayoutModEvent>[]
  distributeToTicketModEvents: Partial<DistributeToTicketModEvent>[]
  deployedERC20Events: Partial<DeployedERC20Event>[]
  veNftContract: Partial<VeNftContract>
}

type ProjectV1 = {
  terminal: string
  metadataUri: string
  metadataDomain: null
  handle: string
} & BaseProject

type ProjectV2 = {
  terminal: null
  metadataUri: string
  metadataDomain: BigNumber
  handle: null
} & BaseProject

export type Project = ProjectV1 | ProjectV2 // Separate entity used for testing

export type ProjectJson = Partial<
  Omit<
    Project,
    | 'participants'
    | 'printPremineEvents'
    | 'payEvents'
    | 'tapEvents'
    | 'redeemEvents'
    | 'printReservesEvents'
    | 'deployedERC20Events'
    | 'distributeToPayoutModEvents'
    | 'distributeToTicketModEvents'
    | 'trendingScore'
    | 'trendingVolume'
    | 'totalPaid'
    | 'totalRedeemed'
    | 'currentBalance'
    | 'veNftContract'
  > & {
    participants: ParticipantJson[]
    printPremineEvents: MintTokensEventJson[]
    payEvents: PayEventJson[]
    tapEvents: TapEventJson[]
    redeemEvents: RedeemEventJson[]
    printReservesEvents: PrintReservesEventJson[]
    deployedERC20Events: DeployedERC20EventJson[]
    distributeToPayoutModEvents: DistributeToPayoutModEventJson[]
    distributeToTicketModEvents: DistributeToTicketModEventJson[]
    veNftContract: VeNftContractJson
    trendingScore: string
    trendingVolume: string
    totalPaid: string
    totalRedeemed: string
    currentBalance: string
  }
>

export const parseProjectJson = (project: ProjectJson): Partial<Project> =>
  ({
    ...project,
    currentBalance: project.currentBalance
      ? BigNumber.from(project.currentBalance)
      : undefined,
    totalPaid: project.totalPaid
      ? BigNumber.from(project.totalPaid)
      : undefined,
    totalRedeemed: project.totalRedeemed
      ? BigNumber.from(project.totalRedeemed)
      : undefined,
    participants: project.participants?.map(parseParticipantJson) ?? undefined,
    printPremineEvents:
      project.printPremineEvents?.map(parseMintTokensEventJson) ?? undefined,
    payEvents: project.payEvents?.map(parsePayEventJson) ?? undefined,
    tapEvents: project.tapEvents?.map(parseTapEventJson) ?? undefined,
    redeemEvents: project.redeemEvents?.map(parseRedeemEventJson) ?? undefined,
    printReservesEvents:
      project.printReservesEvents?.map(parsePrintReservesEventJson) ??
      undefined,
    deployedERC20Events:
      project.deployedERC20Events?.map(parseDeployedERC20EventJson) ??
      undefined,
    distributeToPayoutModEvents:
      project.distributeToPayoutModEvents?.map(
        parseDistributeToPayoutModEvent,
      ) ?? undefined,
    distributeToTicketModEvents:
      project.distributeToTicketModEvents?.map(
        parseDistributeToTicketModEvent,
      ) ?? undefined,
    veNftContract: project.veNftContract
      ? parseVeNftContractJson(project.veNftContract)
      : undefined,
    trendingVolume: project.trendingVolume
      ? BigNumber.from(project.trendingVolume)
      : undefined,
    trendingScore: project.trendingScore
      ? BigNumber.from(project.trendingScore)
      : undefined,
  } as Project)
