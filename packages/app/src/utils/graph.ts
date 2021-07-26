export type SubgraphEntity = 'project' | 'payEvent' | 'redeemEvent'

// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <Entity>(opts: {
  entity: SubgraphEntity
  first?: number
  skip?: number
  orderBy?: keyof Entity
  keys: (keyof Entity | (keyof Entity)[])[]
  orderDirection?: 'asc' | 'desc'
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

  const addArg = (name: string, value?: string | number | keyof Entity) => {
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
      Array.isArray(key)
        ? acc + `{ ${key.map(_key => _key)} }`
        : acc + ' ' + key,
    '',
  )} } }`
}
