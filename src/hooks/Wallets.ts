import { readNetwork } from 'constants/networks'
import {
  InfiniteSGQueryOpts,
  SGEntityKey,
  SGQueryOpts,
  SGWhereArg,
} from 'models/graph'
import { Wallet } from 'models/subgraph-entities/vX/wallet'

import useSubgraphQuery, { useInfiniteSubgraphQuery } from './SubgraphQuery'

interface WalletsOptions {
  pageNumber?: number
  projectId?: number
  orderBy?: keyof Pick<
    Wallet,
    'totalPaid' | 'totalPaidUSD' | 'lastPaidTimestamp'
  >
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  includeAll?: boolean
  keys?: (keyof Wallet)[]
}

const DEFAULT_STALE_TIME = 60 * 1000 // 60 seconds
const DEFAULT_ENTITY_KEYS: (keyof Wallet)[] = [
  'id',
  'totalPaid',
  'lastPaidTimestamp',
]

// We exclude JB contract addresses that may have matching Wallet sg entities
// TODO add addresses
const JB_CONTRACT_ADDRESSES = {
  mainnet: [
    '0x981c8ecd009e3e84ee1ff99266bf1461a12e5c68', // TerminalV1_1
    '0xd569d3cce55b71a8a3f3c418c329a66e5f714431', // TerminalV1
  ],
  goerli: [],
  localhost: [],
}[readNetwork.name]

const queryOpts = (
  opts: WalletsOptions,
): Partial<
  | SGQueryOpts<'wallet', SGEntityKey<'wallet'>>
  | InfiniteSGQueryOpts<'wallet', SGEntityKey<'wallet'>>
> => {
  const where: SGWhereArg<'wallet'>[] = []

  if (!opts.includeAll && JB_CONTRACT_ADDRESSES?.length) {
    where.push({
      key: 'id',
      operator: 'not_in',
      value: JB_CONTRACT_ADDRESSES,
    })
  }

  return {
    entity: 'wallet',
    keys: opts.keys ?? DEFAULT_ENTITY_KEYS,
    orderDirection: opts.orderDirection ?? 'desc',
    orderBy: opts.orderBy ?? 'totalPaid',
    pageSize: opts.pageSize,
    where,
  }
}

export function useWalletsQuery(opts: WalletsOptions) {
  return useSubgraphQuery(
    {
      ...(queryOpts(opts) as SGQueryOpts<'wallet', SGEntityKey<'wallet'>>),
      first: opts.pageSize,
      skip:
        opts.pageNumber && opts.pageSize
          ? opts.pageNumber * opts.pageSize
          : undefined,
    },
    {
      staleTime: DEFAULT_STALE_TIME,
    },
  )
}

export function useInfiniteWalletsQuery(opts: WalletsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteSGQueryOpts<'wallet', SGEntityKey<'wallet'>>,
    { staleTime: DEFAULT_STALE_TIME },
  )
}
