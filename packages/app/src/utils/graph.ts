import axios, { AxiosResponse } from 'axios'
import { subgraphUrl } from 'constants/subgraphs'
import {
  DistributeToPayoutModEvent,
  DistributeToPayoutModEventJson,
} from 'models/subgraph-entities/distribute-to-payout-mod-event copy'
import {
  DistributeToTicketModEvent,
  DistributeToTicketModEventJson,
} from 'models/subgraph-entities/distribute-to-ticket-mod-event'
import { PayEvent, PayEventJson } from 'models/subgraph-entities/pay-event'
import {
  PayerReport,
  PayerReportJson,
} from 'models/subgraph-entities/payer-report'
import {
  PrintReservesEvent,
  PrintReservesEventJson,
} from 'models/subgraph-entities/print-reserves-event'
import { Project, ProjectJson } from 'models/subgraph-entities/project'
import {
  RedeemEvent,
  RedeemEventJson,
} from 'models/subgraph-entities/redeem-event'
import { TapEvent, TapEventJson } from 'models/subgraph-entities/tap-event'

export type SubgraphEntities = {
  project: Project
  payEvent: PayEvent
  redeemEvent: RedeemEvent
  payerReport: PayerReport
  tapEvent: TapEvent
  distributeToPayoutModEvent: DistributeToPayoutModEvent
  distributeToTicketModEvent: DistributeToTicketModEvent
  printReservesEvent: PrintReservesEvent
}

export type SubgraphQueryReturnTypes = {
  project: { projects: ProjectJson[] }
  payEvent: { payEvents: PayEventJson[] }
  redeemEvent: { redeemEvents: RedeemEventJson[] }
  payerReport: { payerReports: PayerReportJson[] }
  tapEvent: { tapEvents: TapEventJson[] }
  distributeToTicketModEvent: {
    distributeToTicketModEvents: DistributeToTicketModEventJson[]
  }
  distributeToPayoutModEvent: {
    distributeToPayoutModEvents: DistributeToPayoutModEventJson[]
  }
  printReservesEvent: {
    printReservesEvents: PrintReservesEventJson[]
  }
}

export type EntityKey = keyof SubgraphEntities

export type OrderDirection = 'asc' | 'desc'

export type WhereConfig = {
  key: string
  value: string | number | boolean
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
}

export type BlockConfig = {
  number?: number
  hash?: string
}

export type GraphQueryOpts<E extends EntityKey> = {
  entity: E
  first?: number
  skip?: number
  orderBy?: keyof SubgraphEntities[E]
  block?: BlockConfig
  keys: (
    | keyof SubgraphEntities[E]
    | {
        entity: EntityKey
        keys: (keyof SubgraphEntities[EntityKey])[]
      }
  )[]
  orderDirection?: OrderDirection
  where?: WhereConfig | WhereConfig[]
}

// https://thegraph.com/docs/graphql-api#filtering
const formatGraphQuery = <E extends EntityKey>(opts: GraphQueryOpts<E>) => {
  let args = ''

  const addArg = (
    name: string,
    value?: string | number | keyof SubgraphEntities[E],
  ) => {
    if (value === undefined) return
    args += (args.length ? ', ' : '') + `${name}: ` + value
  }

  addArg('first', opts.first)
  addArg('skip', opts.skip)
  addArg('orderBy', opts.orderBy)
  addArg('orderDirection', opts.orderDirection)
  if (opts.block) {
    if (opts.block.number) {
      addArg('block', `{ number: ${opts.block.number} }`)
    } else if (opts.block.hash) {
      addArg('block', `{ hash: ${opts.block.hash} }`)
    }
  }
  addArg(
    'where',
    opts.where
      ? Array.isArray(opts.where)
        ? `{ ${opts.where.map(
            w => `${w.key}${w.operator ? '_' + w.operator : ''}: "${w.value}" `,
          )} }`
        : `{ ${opts.where.key}${
            opts.where.operator ? '_' + opts.where.operator : ''
          }: "${opts.where.value}" }`
      : undefined,
  )

  return `{ ${opts.entity}s${args ? `(${args})` : ''} { id${opts.keys.reduce(
    (acc, key) =>
      typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'symbol'
        ? acc + ' ' + key.toString()
        : acc + ` ${key.entity}{ ${key.keys.map(k => k + ' ')} }`,
    '',
  )} } }`
}

export const querySubgraph = <E extends EntityKey>(
  opts: GraphQueryOpts<E>,
  callback: (res?: SubgraphQueryReturnTypes[E]) => void,
) =>
  axios
    .post(
      subgraphUrl,
      {
        query: formatGraphQuery(opts),
      },
      { headers: { 'Content-Type': 'application/json' } },
    )
    .then((res: AxiosResponse<{ data?: SubgraphQueryReturnTypes[E] }>) =>
      callback(res.data?.data),
    )
    .catch(err => console.log('Error getting ' + opts.entity + 's', err))

export const trimHexZero = (hexStr: string) => hexStr.replace('0x0', '0x')
