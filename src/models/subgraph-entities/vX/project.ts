import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  subgraphEntityJsonArrayToKeyVal,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import { PV } from '../../pv'
import { DistributeToPayoutModEvent } from '../v1/distribute-to-payout-mod-event'
import { DistributeToTicketModEvent } from '../v1/distribute-to-ticket-mod-event'
import { PrintReservesEvent } from '../v1/print-reserves-event'
import { TapEvent } from '../v1/tap-event'
import { V1ConfigureEvent } from '../v1/v1-configure'
import { ConfigureEvent } from '../v2/configure'
import { BurnEvent } from './burn-event'
import { DeployedERC20Event } from './deployed-erc20-event'
import { MintTokensEvent } from './mint-tokens-event'
import { Participant } from './participant'
import { PayEvent } from './pay-event'
import { RedeemEvent } from './redeem-event'

export type Project = {
  id: string
  projectId: number
  pv: PV
  owner: string
  deployer: string | null
  createdAt: number
  paymentsCount: number
  redeemCount: number
  trendingPaymentsCount: number
  trendingScore: BigNumber
  trendingVolume: BigNumber
  createdWithinTrendingWindow: boolean
  volume: BigNumber
  volumeUSD: BigNumber
  totalRedeemed: BigNumber
  totalRedeemedUSD: BigNumber
  currentBalance: BigNumber
  participants: Participant[]
  payEvents: PayEvent[]
  printPremineEvents: MintTokensEvent[]
  tapEvents: TapEvent[]
  redeemEvents: RedeemEvent[]
  configureEvents: ConfigureEvent[]
  v1ConfigureEvents: V1ConfigureEvent[]
  printReservesEvents: PrintReservesEvent[]
  distributeToPayoutModEvents: DistributeToPayoutModEvent[]
  distributeToTicketModEvents: DistributeToTicketModEvent[]
  deployedERC20Events: DeployedERC20Event[]
  burnEvents: BurnEvent[]
  metadataUri: string
  terminal: string | null // null in v2
  metadataDomain: BigNumber | null // null in v1
  handle: string | null // can be null in v2
}

export const parseProjectJson = (j: Json<Project>): Project => ({
  ...primitives(j),
  ...parseBigNumberKeyVals(j, [
    'currentBalance',
    'volume',
    'volumeUSD',
    'totalRedeemed',
    'totalRedeemedUSD',
    'trendingScore',
    'trendingVolume',
    'metadataDomain',
  ]),
  ...subgraphEntityJsonArrayToKeyVal(
    j.participants,
    'participant',
    'participants',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.printPremineEvents,
    'mintTokensEvent',
    'printPremineEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(j.payEvents, 'payEvent', 'payEvents'),
  ...subgraphEntityJsonArrayToKeyVal(j.burnEvents, 'burnEvent', 'burnEvents'),
  ...subgraphEntityJsonArrayToKeyVal(j.tapEvents, 'tapEvent', 'tapEvents'),
  ...subgraphEntityJsonArrayToKeyVal(
    j.redeemEvents,
    'redeemEvent',
    'redeemEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.configureEvents,
    'configureEvent',
    'configureEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.v1ConfigureEvents,
    'v1ConfigureEvent',
    'v1ConfigureEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.printReservesEvents,
    'printReservesEvent',
    'printReservesEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.deployedERC20Events,
    'deployedERC20Event',
    'deployedERC20Events',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.distributeToPayoutModEvents,
    'distributeToPayoutModEvent',
    'distributeToPayoutModEvents',
  ),
  ...subgraphEntityJsonArrayToKeyVal(
    j.distributeToTicketModEvents,
    'distributeToTicketModEvent',
    'distributeToTicketModEvents',
  ),
})
