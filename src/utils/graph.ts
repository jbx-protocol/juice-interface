import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import axios from 'axios'
import {
  SGEntity,
  SGEntityKey,
  SGEntityName,
  SGError,
  SGQueryOpts,
  SGResponseData,
  SGWhereArg,
} from 'models/graph'
import { Json } from 'models/json'
import { PV } from 'models/pv'
import { parseDistributeToPayoutModEvent } from 'models/subgraph-entities/v1/distribute-to-payout-mod-event'
import { parseDistributeToTicketModEvent } from 'models/subgraph-entities/v1/distribute-to-ticket-mod-event'
import { parsePrintReservesEventJson } from 'models/subgraph-entities/v1/print-reserves-event'
import { parseTapEventJson } from 'models/subgraph-entities/v1/tap-event'
import { parseV1ConfigureEventJson } from 'models/subgraph-entities/v1/v1-configure'
import { parseConfigureEventJson } from 'models/subgraph-entities/v2/configure'
import { parseDeployETHERC20ProjectPayerEventJson } from 'models/subgraph-entities/v2/deploy-eth-erc20-project-payer-event'
import { parseDistributePayoutsEventJson } from 'models/subgraph-entities/v2/distribute-payouts-event'
import { parseDistributeReservedTokensEventJson } from 'models/subgraph-entities/v2/distribute-reserved-tokens-event'
import { parseDistributeToPayoutSplitEventJson } from 'models/subgraph-entities/v2/distribute-to-payout-split-event'
import { parseDistributeToReservedTokenSplitEventJson } from 'models/subgraph-entities/v2/distribute-to-reserved-token-split-event'
import { parseETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { parseJB721DelegateTokenJson } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { parseUseAllowanceEventJson } from 'models/subgraph-entities/v2/use-allowance-event'
import { parseVeNftContractJson } from 'models/subgraph-entities/v2/venft-contract'
import { parseVeNftTokenJson } from 'models/subgraph-entities/v2/venft-token'
import { parseAddToBalanceEventJson } from 'models/subgraph-entities/vX/add-to-balance-event'
import { parseBurnEventJson } from 'models/subgraph-entities/vX/burn-event'
import { parseDeployedERC20EventJson } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { parseMintTokensEventJson } from 'models/subgraph-entities/vX/mint-tokens-event'
import { parseParticipantJson } from 'models/subgraph-entities/vX/participant'
import { parsePayEventJson } from 'models/subgraph-entities/vX/pay-event'
import { parseProjectJson } from 'models/subgraph-entities/vX/project'
import { parseProjectCreateEventJson } from 'models/subgraph-entities/vX/project-create-event'
import { parseProjectEventJson } from 'models/subgraph-entities/vX/project-event'
import { parseProtocolLogJson } from 'models/subgraph-entities/vX/protocol-log'
import { parseRedeemEventJson } from 'models/subgraph-entities/vX/redeem-event'

const PLURAL_ENTITY_EXCLUSIONS: SGEntityName[] = ['projectSearch']

/**
 * Format a string used to define a subgraph query
 */
export const formatGraphQuery = <
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(
  opts: SGQueryOpts<E, K>,
) => {
  // Reference: https://thegraph.com/docs/graphql-api#filtering
  if (!opts) return

  let args = ''

  const addArg = (name: string, value?: string | number | SGEntityKey<E>) => {
    if (value === undefined) return
    args += (args.length ? ', ' : '') + `${name}: ` + String(value)
  }
  const formatWhere = (where: SGWhereArg<E>) =>
    `${String(where.key)}${where.nested ? '_' : ''}${
      where.operator ? '_' + where.operator : ''
    }:` +
    (Array.isArray(where.value)
      ? `[${where.value
          .map(v => (typeof v === 'string' ? `"${v}"` : v))
          .join(',')}]`
      : typeof where.value === 'string' && !where.nested
      ? `"${where.value}"`
      : where.value)

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
    } else if (opts.block.number_gte) {
      addArg('block', `{ number_gte: ${opts.block.number_gte} }`)
    }
  }
  addArg(
    'where',
    opts.where
      ? Array.isArray(opts.where)
        ? `{${opts.where.map(w => ` ${formatWhere(w)}`)} }`
        : `{ ${formatWhere(opts.where)} }`
      : undefined,
  )

  const overrideEntity: string = opts.entity

  const res = `{ ${overrideEntity}${isPluralQuery(opts.entity) ? 's' : ''}${
    args ? `(${args})` : ''
  } {${opts.keys.reduce(
    (acc, key) =>
      typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'symbol'
        ? acc + ' ' + key.toString()
        : acc + ` ${key.entity.toString()} { ${key.keys.join(' ')} }`,
    '',
  )} } }`
  return res
}

/**
 * Parse a list of entities from a subgraph query JSON response object
 * @param entityName Name of entities to retrieve
 * @param response Response data from subgraph query
 * @returns List of raw JSON subgraph entities
 */
export function entitiesFromSGResponse<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(entityName: E, response: SGResponseData<E, K>) {
  let json: Json<SGEntity<E, K>>[] = []

  const key = PLURAL_ENTITY_EXCLUSIONS.includes(entityName)
    ? entityName
    : `${entityName}s`

  if (response && typeof response === 'object' && key in response) {
    json = response[key as `${E}s`]
  }

  return json
}

/**
 * Format a subgraph entity from raw Json
 * @param entityName Name of entity
 * @param entity Raw JSON subgraph entities
 * @returns Formatted subgraph entity
 */
export function parseSubgraphEntity<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(entityName: E, entity: Json<SGEntity<E, K>>) {
  let fn

  switch (entityName) {
    case 'addToBalanceEvent':
      fn = parseAddToBalanceEventJson
      break
    case 'configureEvent':
      fn = parseConfigureEventJson
      break
    case 'deployedERC20Event':
      fn = parseDeployedERC20EventJson
      break
    case 'deployETHERC20ProjectPayerEvent':
      fn = parseDeployETHERC20ProjectPayerEventJson
      break
    case 'distributePayoutsEvent':
      fn = parseDistributePayoutsEventJson
      break
    case 'distributeReservedTokensEvent':
      fn = parseDistributeReservedTokensEventJson
      break
    case 'distributeToPayoutModEvent':
      fn = parseDistributeToPayoutModEvent
      break
    case 'distributeToPayoutSplitEvent':
      fn = parseDistributeToPayoutSplitEventJson
      break
    case 'distributeToReservedTokenSplitEvent':
      fn = parseDistributeToReservedTokenSplitEventJson
      break
    case 'distributeToTicketModEvent':
      fn = parseDistributeToTicketModEvent
      break
    case 'etherc20ProjectPayer':
      fn = parseETHERC20ProjectPayer
      break
    case 'jb721DelegateToken':
      fn = parseJB721DelegateTokenJson
      break
    case 'mintTokensEvent':
      fn = parseMintTokensEventJson
      break
    case 'printReservesEvent':
      fn = parsePrintReservesEventJson
      break
    case 'payEvent':
      fn = parsePayEventJson
      break
    case 'burnEvent':
      fn = parseBurnEventJson
      break
    case 'project':
      fn = parseProjectJson
      break
    case 'projectCreateEvent':
      fn = parseProjectCreateEventJson
      break
    case 'projectEvent':
      fn = parseProjectEventJson
      break
    case 'protocolLog':
      fn = parseProtocolLogJson
      break
    case 'projectSearch':
      fn = parseProjectJson
      break
    case 'redeemEvent':
      fn = parseRedeemEventJson
      break
    case 'participant':
      fn = parseParticipantJson
      break
    case 'tapEvent':
      fn = parseTapEventJson
      break
    case 'useAllowanceEvent':
      fn = parseUseAllowanceEventJson
      break
    case 'v1ConfigureEvent':
      fn = parseV1ConfigureEventJson
      break
    case 'veNftContract':
      fn = parseVeNftContractJson
      break
    case 'veNftToken':
      fn = parseVeNftTokenJson
      break
    default:
      throw Error(`parseSubgraphEntity(): Unhandled "${entityName}"`)
  }

  return (fn as <T = SGEntity<E, K>>(j: Json<T>) => T)(entity)
}

/**
 * Query subgraph and return list of formatted entities
 */
export async function querySubgraph<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(opts: SGQueryOpts<E, K> | null) {
  if (!opts) return []

  const { entity: entityName } = opts

  const subgraphResponse = await querySubgraphRaw(opts)

  if (!subgraphResponse) return []

  const jsonEntities = entitiesFromSGResponse(entityName, subgraphResponse)

  return jsonEntities.map(j => parseSubgraphEntity(entityName, j))
}

/**
 * Query subgraph and return list of raw entity json
 */
async function querySubgraphRaw<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(opts: SGQueryOpts<E, K> | null) {
  const subgraphUrl =
    process.env.NEXT_SUBGRAPH_URL ?? process.env.NEXT_PUBLIC_SUBGRAPH_URL

  if (!subgraphUrl) throw new Error('Subgraph URL is missing from .env')

  if (!opts) return

  const response = await axios.post<{
    errors?: SGError | SGError[]
    data: SGResponseData<E, K>
  }>(
    opts.url ?? subgraphUrl,
    {
      query: formatGraphQuery(opts),
    },
    { headers: { 'Content-Type': 'application/json' } },
  )

  if ('errors' in response.data) {
    throw new Error(
      (Array.isArray(response.data.errors)
        ? response.data.errors?.[0]?.message
        : response.data.errors?.message) ||
        'Something is wrong with this Graph request',
    )
  }

  return response.data.data
}

/** Repeats a max page size query until all entities have been returned. */
export async function querySubgraphExhaustive<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(opts: Omit<SGQueryOpts<E, K>, 'first' | 'skip'> | null) {
  const pageSize = 1000
  const entities: Pick<SGEntity<E>, K>[] = []

  const query = async (page: number) => {
    if (!opts) return

    const data = await querySubgraph({
      ...opts,
      first: pageSize,
      ...(page > 0
        ? {
            skip: pageSize * page,
          }
        : {}),
    })

    if (!data) return

    entities.push(...data)

    if (data.length === pageSize) await query(page + 1)
  }

  await query(0)

  return entities
}

/** Repeats a max page size query until all entities have been returned, without formatting the response data. */
export async function querySubgraphExhaustiveRaw<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(opts: Omit<SGQueryOpts<E, K>, 'first' | 'skip'> | null) {
  const pageSize = 1000
  const entities: Json<SGEntity<E, K>>[] = []

  const query = async (page: number) => {
    if (!opts) return

    const response = await querySubgraphRaw({
      ...opts,
      first: pageSize,
      ...(page > 0
        ? {
            skip: pageSize * page,
          }
        : {}),
    })

    if (!response) {
      throw new Error('Missing subgraph response')
    }

    const _entities = entitiesFromSGResponse(opts.entity, response)

    if (!_entities) {
      throw new Error("Couldn't parse entities from subgraph response")
    }

    entities.push(..._entities)

    if (entities.length === pageSize) await query(page + 1)
  }

  await query(0)

  return entities
}

const isPluralQuery = (name: SGEntityName): boolean => {
  if (name === 'projectSearch') return false

  return true
}

/**
 * Get the subgraph representation of a project ID, based on given [pv] and [projectId]
 *
 * Reference implementation: https://github.com/jbx-protocol/juice-subgraph/blob/main/src/utils.ts#L84
 *
 * @param pv Contracts version
 * @param projectId the on-chain project ID
 */
export const getSubgraphIdForProject = (pv: PV, projectId: number) => {
  return `${pv}-${projectId}`
}

export const parseBigNumberKeyVals = <T extends object, K extends keyof T>(
  json: T,
  keys: K[],
) => {
  return keys.reduce(
    (acc, k) => ({
      ...acc,
      ...parseBigNumberKeyVal(k, json[k]),
    }),
    {} as { [k in K]: BigNumber },
  )
}

/**
 * Parse a key value pair from an object
 * @param key Name of key
 * @param val Value to convert to BigNumber
 * @returns Key value pair, where value is a BigNumber
 */
export const parseBigNumberKeyVal = <K extends string | number | symbol>(
  key: K,
  val: unknown,
) => {
  let output

  try {
    if (isBigNumberish(val)) output = { [key]: BigNumber.from(val) }
  } catch (e) {
    output = {}
  }

  return output as { [k in K]: BigNumber }
}

/**
 * Format subgraph entities from key value pairs in a JSON object. Requires that entity key in object matches entity name.
 * @param json JSON object containing key value pairs of raw JSON subgraph entities.
 * @param entities Name of entities to parse.
 * @returns Object containing key values of formatted subgraph entities.
 */
export const parseSubgraphEntitiesFromJson = <E extends SGEntityName>(
  json: Record<E, Json<SGEntity<E>> | null | undefined>,
  entities: E[],
) =>
  entities.reduce(
    (acc, e) => ({
      ...acc,
      ...subgraphEntityJsonToKeyVal(json[e], e, e),
    }),
    {} as {
      [e in E]: SGEntity<e>
    },
  )

/**
 *  Format the value of a key value pair, where the value is a raw JSON subgraph entity.
 * @param entityName Name of entity to parse
 * @param json Raw JSON subgraph entity
 * @param key Key of returned key value pair
 * @returns Key value pair
 */
export const subgraphEntityJsonToKeyVal = <
  E extends SGEntityName,
  K extends string,
>(
  json: Json<SGEntity<E>> | null | undefined,
  entityName: E,
  key: K,
) =>
  (json
    ? { [key ?? entityName]: parseSubgraphEntity(entityName, json) }
    : {}) as Record<K, SGEntity<E>>

/**
 * Parse an array of raw JSON subgraph entities and return a key value pair.
 * @param jsonArra Array of raw JSON subgraph entities of a single type.
 * @param entityName Name of entity being parsed.
 * @param key Key to return as key value pair.
 * @returns Key value pair, where key is `key` and value is an array of formatted subgraph entities.
 */
export const subgraphEntityJsonArrayToKeyVal = <
  E extends SGEntityName,
  K extends string,
>(
  jsonArray: Json<SGEntity<E>>[] | undefined,
  entityName: E,
  key: K,
) =>
  (jsonArray
    ? {
        [key]: jsonArray.reduce(
          (acc, curr) => [...acc, parseSubgraphEntity(entityName, curr)],
          [] as SGEntity<E>[],
        ),
      }
    : {}) as Record<K, SGEntity<E>[]>
