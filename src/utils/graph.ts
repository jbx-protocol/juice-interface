import axios, { AxiosResponse } from 'axios'
import {
  DistributeToPayoutModEvent,
  DistributeToPayoutModEventJson,
  parseDistributeToPayoutModEvent,
} from 'models/subgraph-entities/distribute-to-payout-mod-event copy'
import {
  DistributeToTicketModEvent,
  DistributeToTicketModEventJson,
  parseDistributeToTicketModEvent,
} from 'models/subgraph-entities/distribute-to-ticket-mod-event'
import {
  parseParticipantJson,
  Participant,
  ParticipantJson,
} from 'models/subgraph-entities/participant'
import {
  parsePayEventJson,
  PayEvent,
  PayEventJson,
} from 'models/subgraph-entities/pay-event'
import {
  parsePrintReservesEventJson,
  PrintReservesEvent,
  PrintReservesEventJson,
} from 'models/subgraph-entities/print-reserves-event'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from 'models/subgraph-entities/redeem-event'
import {
  parseTapEventJson,
  TapEvent,
  TapEventJson,
} from 'models/subgraph-entities/tap-event'

export interface SubgraphEntities {
  project: Project
  projectSearch: Project
  payEvent: PayEvent
  redeemEvent: RedeemEvent
  participant: Participant
  tapEvent: TapEvent
  distributeToPayoutModEvent: DistributeToPayoutModEvent
  distributeToTicketModEvent: DistributeToTicketModEvent
  printReservesEvent: PrintReservesEvent
}

export interface SubgraphQueryReturnTypes {
  project: { projects: ProjectJson[] }
  projectSearch: { projectSearch: ProjectJson[] }
  payEvent: { payEvents: PayEventJson[] }
  redeemEvent: { redeemEvents: RedeemEventJson[] }
  participant: { participants: ParticipantJson[] }
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

export interface SubgraphError {
  locations: { column: number; line: number }[]
  message: string
}

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

export type EntityKeys<E extends EntityKey> = keyof SubgraphEntities[E]

export interface GraphQueryOpts<E extends EntityKey, K extends EntityKeys<E>> {
  entity: E
  text?: string
  first?: number
  skip?: number
  orderBy?: keyof SubgraphEntities[E]
  block?: BlockConfig

  // `keys` can be a mix of the entity's keys or an entity specifier with its own keys
  keys: (
    | K
    | {
        entity: EntityKey
        keys: string[] // hard to type accurate nested keys. All bets are off when this is used.
      }
  )[]
  orderDirection?: OrderDirection
  where?: WhereConfig | WhereConfig[]
}

// Re-type GraphQueryOpts to remove skip and add pageSize.
// This is so we can calculate our own `skip` value based on
// the react-query managed page number multiplied by the provided
// page size.
export type InfiniteGraphQueryOpts<
  E extends EntityKey,
  K extends EntityKeys<E>,
> = Omit<GraphQueryOpts<E, K>, 'skip'> & {
  pageSize: number
}

// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <E extends EntityKey, K extends EntityKeys<E>>(
  opts: GraphQueryOpts<E, K>,
) => {
  let args = ''

  const addArg = (
    name: string,
    value?: string | number | keyof SubgraphEntities[E],
  ) => {
    if (value === undefined) return
    args += (args.length ? ', ' : '') + `${name}: ` + value
  }

  addArg('text', opts.text ? `"${opts.text}"` : undefined)
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

  return `{ ${opts.entity}${isPluralQuery(opts.entity) ? 's' : ''}${
    args ? `(${args})` : ''
  } { id${opts.keys.reduce(
    (acc, key) =>
      typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'symbol'
        ? acc + ' ' + key.toString()
        : acc + ` ${key.entity}{ ${key.keys.map(k => k + ' ')} }`,
    '',
  )} } }`
}

const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL

export const querySubgraph = <E extends EntityKey, K extends EntityKeys<E>>(
  opts: GraphQueryOpts<E, K>,
  callback: (res?: SubgraphQueryReturnTypes[E]) => void,
) =>
  subgraphUrl
    ? axios
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
    : Promise.reject('Missing url for subgraph query')

export const trimHexZero = (hexStr: string) => hexStr.replace('0x0', '0x')

export function formatGraphResponse<E extends EntityKey>(
  entity: E,
  response: SubgraphQueryReturnTypes[E],
): SubgraphEntities[E][] {
  if (!response || typeof response !== 'object') {
    return []
  }

  // This code works perfectly, but there's an unusual TypeScript issue that
  // makes it appear type unsafe...
  //
  // For example, `response.projects` is a ProjectJson[], as dictated by
  // SubgraphQueryReturnTypes['projects']
  // We then map over that array to return a Project[], but for some reason,
  // TypeScript isn't equating `Project` with `SubgraphEntities['project']`,
  // even though they're the same type.
  //
  // If you think you can solve it and remove the @ts-ignore, be my guest.
  // My best guess is a conditional resolver type, ie:
  // type EntityResolver<E extends EntityKey> = E extends 'project' ? Project : ...
  // in favor of the main SubgraphEntities type. I tried it, though, to no avail.

  switch (entity) {
    case 'project':
      if ('projects' in response) {
        // @ts-ignore
        return response.projects.map(parseProjectJson)
      }
      break
    case 'projectSearch':
      if ('projectSearch' in response) {
        // @ts-ignore
        return response.projectSearch.map(parseProjectJson)
      }
      break
    case 'payEvent':
      if ('payEvents' in response) {
        // @ts-ignore
        return response.payEvents.map(parsePayEventJson)
      }
      break
    case 'redeemEvent':
      if ('redeemEvents' in response) {
        // @ts-ignore
        return response.redeemEvents.map(parseRedeemEventJson)
      }
      break
    case 'participant':
      if ('participants' in response) {
        // @ts-ignore
        return response.participants.map(parseParticipantJson)
      }
      break
    case 'tapEvent':
      if ('tapEvents' in response) {
        // @ts-ignore
        return response.tapEvents.map(parseTapEventJson)
      }
      break
    case 'distributeToPayoutModEvent':
      if ('distributeToPayoutModEvents' in response) {
        // @ts-ignore
        return response.distributeToPayoutModEvents.map(
          parseDistributeToPayoutModEvent,
        )
      }
      break
    case 'distributeToTicketModEvent':
      if ('distributeToTicketModEvents' in response) {
        // @ts-ignore
        return response.distributeToTicketModEvents.map(
          parseDistributeToTicketModEvent,
        )
      }
      break
    case 'printReservesEvent':
      if ('printReservesEvents' in response) {
        // @ts-ignore
        return response.printReservesEvents.map(parsePrintReservesEventJson)
      }
      break
  }

  return []
}

const isPluralQuery = (key: EntityKey): boolean => {
  if (key === 'projectSearch') return false

  return true
}
