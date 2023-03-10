import { Json } from './json'
import { DistributeToPayoutModEvent } from './subgraph-entities/v1/distribute-to-payout-mod-event'
import { DistributeToTicketModEvent } from './subgraph-entities/v1/distribute-to-ticket-mod-event'
import { PrintReservesEvent } from './subgraph-entities/v1/print-reserves-event'
import { TapEvent } from './subgraph-entities/v1/tap-event'
import { V1ConfigureEvent } from './subgraph-entities/v1/v1-configure'
import { ConfigureEvent } from './subgraph-entities/v2/configure'
import { DeployETHERC20ProjectPayerEvent } from './subgraph-entities/v2/deploy-eth-erc20-project-payer-event'
import { DistributePayoutsEvent } from './subgraph-entities/v2/distribute-payouts-event'
import { DistributeReservedTokensEvent } from './subgraph-entities/v2/distribute-reserved-tokens-event'
import { DistributeToPayoutSplitEvent } from './subgraph-entities/v2/distribute-to-payout-split-event'
import { DistributeToReservedTokenSplitEvent } from './subgraph-entities/v2/distribute-to-reserved-token-split-event'
import { ETHERC20ProjectPayer } from './subgraph-entities/v2/eth-erc20-project-payer'
import { JB721DelegateToken } from './subgraph-entities/v2/jb-721-delegate-tokens'
import { SetFundAccessConstraintsEvent } from './subgraph-entities/v2/set-fund-access-constraints-event'
import { UseAllowanceEvent } from './subgraph-entities/v2/use-allowance-event'
import { VeNftContract } from './subgraph-entities/v2/venft-contract'
import { VeNftToken } from './subgraph-entities/v2/venft-token'
import { AddToBalanceEvent } from './subgraph-entities/vX/add-to-balance-event'
import { BurnEvent } from './subgraph-entities/vX/burn-event'
import { DeployedERC20Event } from './subgraph-entities/vX/deployed-erc20-event'
import { MintTokensEvent } from './subgraph-entities/vX/mint-tokens-event'
import { Participant } from './subgraph-entities/vX/participant'
import { PayEvent } from './subgraph-entities/vX/pay-event'
import { Project } from './subgraph-entities/vX/project'
import { ProjectCreateEvent } from './subgraph-entities/vX/project-create-event'
import { ProjectEvent } from './subgraph-entities/vX/project-event'
import { ProtocolLog } from './subgraph-entities/vX/protocol-log'
import { RedeemEvent } from './subgraph-entities/vX/redeem-event'
import { Wallet } from './subgraph-entities/vX/wallet'

interface SGEntities {
  addToBalanceEvent: AddToBalanceEvent
  burnEvent: BurnEvent
  configureEvent: ConfigureEvent
  deployedERC20Event: DeployedERC20Event
  deployETHERC20ProjectPayerEvent: DeployETHERC20ProjectPayerEvent
  distributePayoutsEvent: DistributePayoutsEvent
  distributeReservedTokensEvent: DistributeReservedTokensEvent
  distributeToPayoutModEvent: DistributeToPayoutModEvent
  distributeToPayoutSplitEvent: DistributeToPayoutSplitEvent
  distributeToReservedTokenSplitEvent: DistributeToReservedTokenSplitEvent
  distributeToTicketModEvent: DistributeToTicketModEvent
  etherc20ProjectPayer: ETHERC20ProjectPayer
  jb721DelegateToken: JB721DelegateToken
  mintTokensEvent: MintTokensEvent
  payEvent: PayEvent
  project: Project
  projectCreateEvent: ProjectCreateEvent
  projectEvent: ProjectEvent
  projectSearch: Project
  protocolLog: ProtocolLog
  participant: Participant
  printReservesEvent: PrintReservesEvent
  redeemEvent: RedeemEvent
  setFundAccessConstraintsEvent: SetFundAccessConstraintsEvent
  tapEvent: TapEvent
  useAllowanceEvent: UseAllowanceEvent
  v1ConfigureEvent: V1ConfigureEvent
  veNftContract: VeNftContract
  veNftToken: VeNftToken
  wallet: Wallet
}

export type SGEntityName = keyof SGEntities

export type SGEntity<
  E extends SGEntityName,
  K extends keyof SGEntities[E] = keyof SGEntities[E],
> = Pick<SGEntities[E], K>

export type SGEntityKey<E extends SGEntityName> = keyof SGEntity<E>

export type SGResponseData<E extends SGEntityName, K extends SGEntityKey<E>> = {
  [k in `${E}s`]: Json<SGEntity<E, K>>[]
}

export interface SGError {
  locations: { column: number; line: number }[]
  message: string
}

export type SGOrderDir = 'asc' | 'desc'

export type SGWhereArg<E extends SGEntityName> = {
  key: SGEntityKey<E>
  value: string | number | boolean | null | (string | number | boolean | null)[]
  operator?:
    | 'not'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'in'
    | 'not_in'
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'not_starts_with'
    | 'not_ends_with'
  nested?: boolean
}

export type SGBlockConfig = {
  number?: number
  number_gte?: number
  hash?: string
}

export interface SGQueryOpts<E extends SGEntityName, K extends SGEntityKey<E>> {
  entity: E
  text?: string
  first?: number
  skip?: number
  orderBy?: SGEntityKey<E>
  block?: SGBlockConfig
  url?: string

  // `keys` can be a mix of the entity's keys or an entity specifier with its own keys
  keys: (
    | K
    | {
        entity: K
        keys: string[] // hard to type accurate nested keys. All bets are off when this is used.
      }
  )[]
  orderDirection?: SGOrderDir
  where?: SGWhereArg<E> | SGWhereArg<E>[]
}

// Re-type SGQueryOpts to remove skip and add pageSize.
// This is so we can calculate our own `skip` value based on
// the react-query managed page number multiplied by the provided
// page size.
export type InfiniteSGQueryOpts<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
> = Omit<SGQueryOpts<E, K>, 'skip'> & {
  pageSize: number
}
