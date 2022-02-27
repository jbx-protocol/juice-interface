import { SerializedTrendingProject } from 'models/ipfs-cache-entities/trending-project'
import { TrendingProject } from 'models/subgraph-entities/project'
import { IpfsCache } from 'utils/ipfs'

export type IpfsCacheSerialData = {
  [IpfsCache.trending]: SerializedTrendingProject[]
}

export type IpfsCacheData = {
  [IpfsCache.trending]: TrendingProject[]
}
