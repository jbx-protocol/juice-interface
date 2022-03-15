import { parsePayEventJson, PayEvent, PayEventJson } from './pay-event'
import {
  TapEvent,
  TapEventJson,
  parseTapEventJson,
} from 'models/subgraph-entities/tap-event'
import {
  parsePrintPremineEventJson,
  PrintPremineEvent,
  PrintPremineEventJson,
} from './print-premine-event'
import {
  PrintReservesEvent,
  PrintReservesEventJson,
  parsePrintReservesEventJson,
} from 'models/subgraph-entities/print-reserves-event'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from './redeem-event'
import {
  DeployedERC20Event,
  DeployedERC20EventJson,
  parseDeployedERC20EventJson,
} from './deployed-erc20-event'
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

export type ProjectEvent = {
  id: string
  timestamp: number
  projectId: number
  cv: 1 | 2

  payEvent: Partial<PayEvent> | null
  tapEvent: Partial<TapEvent> | null
  printPremineEvent: Partial<PrintPremineEvent> | null
  printReservesEvent: Partial<PrintReservesEvent> | null
  redeemEvent: Partial<RedeemEvent> | null
  deployedERC20Event: Partial<DeployedERC20Event> | null
  distributeToPayoutModEvent: Partial<DistributeToPayoutModEvent> | null
  distributeToTicketModEvent: Partial<DistributeToTicketModEvent> | null
}

export type ProjectEventJson = Pick<ProjectEvent, 'id' | 'timestamp'> & {
  projectId: number
  cv: 1 | 2
  payEvent: PayEventJson | null
  tapEvent: TapEventJson | null
  printPremineEvent: PrintPremineEventJson | null
  printReservesEvent: PrintReservesEventJson | null
  redeemEvent: RedeemEventJson | null
  deployedERC20Event: DeployedERC20EventJson | null
  distributeToPayoutModEvent: DistributeToPayoutModEventJson | null
  distributeToTicketModEvent: DistributeToTicketModEventJson | null
}

export const parseProjectEventJson = (
  json: ProjectEventJson,
): ProjectEvent => ({
  ...json,
  payEvent: json.payEvent ? parsePayEventJson(json.payEvent) : null,
  tapEvent: json.tapEvent ? parseTapEventJson(json.tapEvent) : null,
  printPremineEvent: json.printPremineEvent
    ? parsePrintPremineEventJson(json.printPremineEvent)
    : null,
  printReservesEvent: json.printReservesEvent
    ? parsePrintReservesEventJson(json.printReservesEvent)
    : null,
  redeemEvent: json.redeemEvent ? parseRedeemEventJson(json.redeemEvent) : null,
  deployedERC20Event: json.deployedERC20Event
    ? parseDeployedERC20EventJson(json.deployedERC20Event)
    : null,
  distributeToPayoutModEvent: json.distributeToPayoutModEvent
    ? parseDistributeToPayoutModEvent(json.distributeToPayoutModEvent)
    : null,
  distributeToTicketModEvent: json.distributeToTicketModEvent
    ? parseDistributeToTicketModEvent(json.distributeToTicketModEvent)
    : null,
})
