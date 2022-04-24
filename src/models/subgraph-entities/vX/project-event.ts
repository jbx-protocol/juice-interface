import {
  parsePrintReservesEventJson,
  PrintReservesEvent,
  PrintReservesEventJson,
} from 'models/subgraph-entities/v1/print-reserves-event'
import {
  parseTapEventJson,
  TapEvent,
  TapEventJson,
} from 'models/subgraph-entities/v1/tap-event'

import { CV } from '../../cv'
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
import {
  DistributePayoutsEvent,
  DistributePayoutsEventJson,
  parseDistributePayoutsEventJson,
} from '../v2/distribute-payouts-event'
import {
  DistributeReservedTokensEvent,
  DistributeReservedTokensEventJson,
  parseDistributeReservedTokensEventJson,
} from '../v2/distribute-reserved-tokens-event'
import {
  DistributeToPayoutSplitEventJson,
  parseDistributeToPayoutSplitEventJson,
} from '../v2/distribute-to-payout-split-event'
import {
  DistributeToReservedTokenSplitEvent,
  DistributeToReservedTokenSplitEventJson,
  parseDistributeToReservedTokenSplitEventJson,
} from '../v2/distribute-to-reserved-token-split-event'
import {
  parseUseAllowanceEventJson,
  UseAllowanceEvent,
  UseAllowanceEventJson,
} from '../v2/use-allowance-event'
import {
  DeployedERC20Event,
  DeployedERC20EventJson,
  parseDeployedERC20EventJson,
} from './deployed-erc20-event'
import {
  MintTokensEvent,
  MintTokensEventJson,
  parseMintTokensEventJson,
} from './mint-tokens-event'
import { parsePayEventJson, PayEvent, PayEventJson } from './pay-event'
import {
  parseProjectCreateEventJson,
  ProjectCreateEvent,
  ProjectCreateEventJson,
} from './project-create-event'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from './redeem-event'

export type ProjectEvent = {
  id: string
  timestamp: number
  projectId: number
  cv: CV

  // V1 & V2
  payEvent: Partial<PayEvent> | null
  mintTokensEvent: Partial<MintTokensEvent> | null
  redeemEvent: Partial<RedeemEvent> | null
  deployedERC20Event: Partial<DeployedERC20Event> | null
  projectCreateEvent: Partial<ProjectCreateEvent> | null

  // Only V1
  tapEvent: Partial<TapEvent> | null
  printReservesEvent: Partial<PrintReservesEvent> | null
  distributeToPayoutModEvent: Partial<DistributeToPayoutModEvent> | null
  distributeToTicketModEvent: Partial<DistributeToTicketModEvent> | null

  // Only V2
  distributePayoutsEvent: Partial<DistributePayoutsEvent> | null
  distributeReservedTokensEvent: Partial<DistributeReservedTokensEvent> | null
  distributeToPayoutSplitEvent: Partial<DistributePayoutsEvent> | null
  distributeToReservedTokenSplitEvent: Partial<DistributeToReservedTokenSplitEvent> | null
  useAllowanceEvent: Partial<UseAllowanceEvent> | null
}

export type ProjectEventJson = Pick<
  ProjectEvent,
  'id' | 'timestamp' | 'projectId' // primitive types
> & {
  cv: CV
  payEvent: PayEventJson | null
  mintTokensEvent: MintTokensEventJson | null
  redeemEvent: RedeemEventJson | null
  deployedERC20Event: DeployedERC20EventJson | null
  projectCreateEvent: ProjectCreateEventJson | null

  tapEvent: TapEventJson | null
  printReservesEvent: PrintReservesEventJson | null
  distributeToPayoutModEvent: DistributeToPayoutModEventJson | null
  distributeToTicketModEvent: DistributeToTicketModEventJson | null

  distributePayoutsEvent: DistributePayoutsEventJson | null
  distributeReservedTokensEvent: DistributeReservedTokensEventJson | null
  distributeToReservedTokenSplitEvent: DistributeToReservedTokenSplitEventJson | null
  distributeToPayoutSplitEvent: DistributeToPayoutSplitEventJson | null
  useAllowanceEvent: UseAllowanceEventJson | null
}

export const parseProjectEventJson = (j: ProjectEventJson): ProjectEvent => ({
  ...j,
  payEvent: j.payEvent ? parsePayEventJson(j.payEvent) : null,
  mintTokensEvent: j.mintTokensEvent
    ? parseMintTokensEventJson(j.mintTokensEvent)
    : null,
  redeemEvent: j.redeemEvent ? parseRedeemEventJson(j.redeemEvent) : null,
  deployedERC20Event: j.deployedERC20Event
    ? parseDeployedERC20EventJson(j.deployedERC20Event)
    : null,
  projectCreateEvent: j.projectCreateEvent
    ? parseProjectCreateEventJson(j.projectCreateEvent)
    : null,
  tapEvent: j.tapEvent ? parseTapEventJson(j.tapEvent) : null,
  printReservesEvent: j.printReservesEvent
    ? parsePrintReservesEventJson(j.printReservesEvent)
    : null,
  distributeToPayoutModEvent: j.distributeToPayoutModEvent
    ? parseDistributeToPayoutModEvent(j.distributeToPayoutModEvent)
    : null,
  distributeToTicketModEvent: j.distributeToTicketModEvent
    ? parseDistributeToTicketModEvent(j.distributeToTicketModEvent)
    : null,
  distributePayoutsEvent: j.distributePayoutsEvent
    ? parseDistributePayoutsEventJson(j.distributePayoutsEvent)
    : null,
  distributeReservedTokensEvent: j.distributeReservedTokensEvent
    ? parseDistributeReservedTokensEventJson(j.distributeReservedTokensEvent)
    : null,
  distributeToReservedTokenSplitEvent: j.distributeToReservedTokenSplitEvent
    ? parseDistributeToReservedTokenSplitEventJson(
        j.distributeToReservedTokenSplitEvent,
      )
    : null,
  distributeToPayoutSplitEvent: j.distributeToPayoutSplitEvent
    ? parseDistributeToPayoutSplitEventJson(j.distributeToPayoutSplitEvent)
    : null,
  useAllowanceEvent: j.useAllowanceEvent
    ? parseUseAllowanceEventJson(j.useAllowanceEvent)
    : null,
})
