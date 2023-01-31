import { PV } from 'models/project'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { parseSubgraphEntitiesFromJson } from 'utils/graph'

import { Json, primitives } from '../../json'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { TerminalEventEntity } from '../base/terminal-event'
import { DistributeToPayoutModEvent } from '../v1/distribute-to-payout-mod-event'
import { DistributeToTicketModEvent } from '../v1/distribute-to-ticket-mod-event'
import { V1ConfigureEvent } from '../v1/v1-configure'
import { ConfigureEvent } from '../v2/configure'
import { DeployETHERC20ProjectPayerEvent } from '../v2/deploy-eth-erc20-project-payer-event'
import { DistributePayoutsEvent } from '../v2/distribute-payouts-event'
import { DistributeReservedTokensEvent } from '../v2/distribute-reserved-tokens-event'
import { DistributeToPayoutSplitEvent } from '../v2/distribute-to-payout-split-event'
import { DistributeToReservedTokenSplitEvent } from '../v2/distribute-to-reserved-token-split-event'
import { UseAllowanceEvent } from '../v2/use-allowance-event'
import { AddToBalanceEvent } from './add-to-balance-event'
import { DeployedERC20Event } from './deployed-erc20-event'
import { MintTokensEvent } from './mint-tokens-event'
import { PayEvent } from './pay-event'
import { ProjectCreateEvent } from './project-create-event'
import { RedeemEvent } from './redeem-event'

export interface ProjectEvent extends TerminalEventEntity, BaseProjectEntity {
  pv: PV
  terminal: string
  timestamp: number

  // V1 & V2
  payEvent: PayEvent | null
  addToBalanceEvent: AddToBalanceEvent | null
  mintTokensEvent: MintTokensEvent | null
  redeemEvent: RedeemEvent | null
  deployedERC20Event: DeployedERC20Event | null
  projectCreateEvent: ProjectCreateEvent | null

  // Only V1
  tapEvent: TapEvent | null
  printReservesEvent: PrintReservesEvent | null
  distributeToPayoutModEvent: DistributeToPayoutModEvent | null
  distributeToTicketModEvent: DistributeToTicketModEvent | null
  v1ConfigureEvent: V1ConfigureEvent | null

  // Only V2
  distributePayoutsEvent: DistributePayoutsEvent | null
  distributeReservedTokensEvent: DistributeReservedTokensEvent | null
  distributeToPayoutSplitEvent: DistributeToPayoutSplitEvent | null
  distributeToReservedTokenSplitEvent: DistributeToReservedTokenSplitEvent | null
  useAllowanceEvent: UseAllowanceEvent | null
  deployETHERC20ProjectPayerEvent: DeployETHERC20ProjectPayerEvent | null
  configureEvent: ConfigureEvent | null
}

export const parseProjectEventJson = (j: Json<ProjectEvent>): ProjectEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseSubgraphEntitiesFromJson(j, [
    'payEvent',
    'project',
    'addToBalanceEvent',
    'mintTokensEvent',
    'redeemEvent',
    'deployedERC20Event',
    'projectCreateEvent',
    'tapEvent',
    'printReservesEvent',
    'distributeToTicketModEvent',
    'distributeToPayoutModEvent',
    'distributePayoutsEvent',
    'distributeReservedTokensEvent',
    'distributeToReservedTokenSplitEvent',
    'distributeToPayoutSplitEvent',
    'useAllowanceEvent',
    'deployETHERC20ProjectPayerEvent',
    'configureEvent',
    'v1ConfigureEvent',
  ]),
})
