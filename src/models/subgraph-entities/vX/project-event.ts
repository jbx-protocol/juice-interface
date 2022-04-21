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
import { parsePayEventJson, PayEvent, PayEventJson } from './pay-event'
import {
  parseMintTokensEventJson,
  MintTokensEvent,
  MintTokensEventJson,
} from './mint-tokens-event'
import { ProjectCreateEvent } from './project-create-event'
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

  payEvent: Partial<PayEvent> | null
  tapEvent: Partial<TapEvent> | null
  printPremineEvent: Partial<MintTokensEvent> | null
  printReservesEvent: Partial<PrintReservesEvent> | null
  redeemEvent: Partial<RedeemEvent> | null
  deployedERC20Event: Partial<DeployedERC20Event> | null
  distributeToPayoutModEvent: Partial<DistributeToPayoutModEvent> | null
  distributeToTicketModEvent: Partial<DistributeToTicketModEvent> | null
  projectCreateEvent: Partial<ProjectCreateEvent> | null
}

export type ProjectEventJson = Pick<ProjectEvent, 'id' | 'timestamp'> & {
  projectId: number
  cv: CV
  payEvent: PayEventJson | null
  tapEvent: TapEventJson | null
  printPremineEvent: MintTokensEventJson | null
  printReservesEvent: PrintReservesEventJson | null
  redeemEvent: RedeemEventJson | null
  deployedERC20Event: DeployedERC20EventJson | null
  distributeToPayoutModEvent: DistributeToPayoutModEventJson | null
  distributeToTicketModEvent: DistributeToTicketModEventJson | null
  projectCreateEvent: ProjectCreateEvent | null
}

export const parseProjectEventJson = (j: ProjectEventJson): ProjectEvent => ({
  ...j,
  payEvent: j.payEvent ? parsePayEventJson(j.payEvent) : null,
  tapEvent: j.tapEvent ? parseTapEventJson(j.tapEvent) : null,
  printPremineEvent: j.printPremineEvent
    ? parseMintTokensEventJson(j.printPremineEvent)
    : null,
  printReservesEvent: j.printReservesEvent
    ? parsePrintReservesEventJson(j.printReservesEvent)
    : null,
  redeemEvent: j.redeemEvent ? parseRedeemEventJson(j.redeemEvent) : null,
  deployedERC20Event: j.deployedERC20Event
    ? parseDeployedERC20EventJson(j.deployedERC20Event)
    : null,
  distributeToPayoutModEvent: j.distributeToPayoutModEvent
    ? parseDistributeToPayoutModEvent(j.distributeToPayoutModEvent)
    : null,
  distributeToTicketModEvent: j.distributeToTicketModEvent
    ? parseDistributeToTicketModEvent(j.distributeToTicketModEvent)
    : null,
})
