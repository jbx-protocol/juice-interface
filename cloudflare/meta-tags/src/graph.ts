/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parseProjectJson, Project, ProjectJson } from './models/project'

export interface SubgraphEntities {
  project: Project
}

export interface SubgraphQueryReturnTypes {
  project: { projects: ProjectJson[] }
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

export type EntityKeys<E extends EntityKey> = keyof SubgraphEntities[E]

export interface GraphQueryOpts<E extends EntityKey, K extends EntityKeys<E>> {
  entity: E
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

// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <E extends EntityKey, K extends EntityKeys<E>>(
  opts: GraphQueryOpts<E, K>,
): string => {
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
            (w) =>
              `${w.key}${w.operator ? '_' + w.operator : ''}: "${w.value}" `,
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
        : acc + ` ${key.entity}{ ${key.keys.map((k) => k + ' ')} }`,
    '',
  )} } }`
}

export const querySubgraph = async <
  E extends EntityKey,
  K extends EntityKeys<E>,
>(
  opts: GraphQueryOpts<E, K>,
): Promise<SubgraphQueryReturnTypes[E] | undefined> => {
  try {
    const res = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: formatGraphQuery(opts),
      }),
    })
    const data = (await res.json()) as { data: Record<string, unknown> }
    return data.data as SubgraphQueryReturnTypes[E]
  } catch (error: unknown) {
    console.log(error)
  }
}

export const trimHexZero = (hexStr: string): string =>
  hexStr.replace('0x0', '0x')

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
  }

  return []
}
