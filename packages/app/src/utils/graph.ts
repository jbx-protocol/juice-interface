import { PayEvent } from 'models/subgraph-entities/pay-event'
import { PayerReport } from 'models/subgraph-entities/payer-report'
import { Project } from 'models/subgraph-entities/project'
import { RedeemEvent } from 'models/subgraph-entities/redeem-event'

export type SubgraphEntities = {
  project: Project
  payEvent: PayEvent
  redeemEvent: RedeemEvent
  payerReport: PayerReport
}

export type EntityKey = keyof SubgraphEntities

export type OrderDirection = 'asc' | 'desc'

// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <E extends EntityKey>(opts: {
  entity: E
  first?: number
  skip?: number
  orderBy?: keyof SubgraphEntities[E]
  keys: (
    | keyof SubgraphEntities[E]
    | {
        entity: EntityKey
        keys: (keyof SubgraphEntities[EntityKey])[]
      }
  )[]
  orderDirection?: OrderDirection
  where?: {
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
}) => {
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
  addArg(
    'where',
    opts.where
      ? `{ ${opts.where.key}${
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

export const trimHexZero = (hexStr: string) => hexStr.replace('0x0', '0x')
