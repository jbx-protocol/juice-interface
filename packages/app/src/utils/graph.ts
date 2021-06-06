// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <Entity>(options: {
  entity: 'project'
  first?: number
  skip?: number
  orderBy?: keyof Entity
  keys: (keyof Entity | (keyof Entity)[])[]
  orderDirection?: 'asc' | 'desc'
  where?: { key: string; value: string | number | boolean }
}) => {
  let args = ''

  const addArg = (name: string, value?: string | number) => {
    if (value === undefined) return
    args += (args.length ? ', ' : '') + `${name}: ` + value
  }

  addArg('first', options.first)
  addArg('skip', options.skip)
  addArg('orderBy', options.skip)
  addArg('orderDirection', options.orderDirection)
  addArg(
    'where',
    options.where
      ? `{ ${options.where.key}: "${options.where.value}" }`
      : undefined,
  )

  return `{ ${options.entity}s${
    args ? `(${args})` : ''
  } { id${options.keys.reduce<string>(
    (acc, key) =>
      Array.isArray(key)
        ? acc + `{ ${key.map(_key => _key)} }`
        : acc + ' ' + key,
    '',
  )} } }`
}
