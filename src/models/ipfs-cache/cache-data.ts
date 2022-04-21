import {
  TrendingProject,
  TrendingProjectJson,
} from 'models/subgraph-entities/vX/project'

import { IpfsCacheName } from './cache-name'

export type IpfsCacheJsonData = {
  [IpfsCacheName.trending]: TrendingProjectJson[]
  [IpfsCacheName.trendingV2]: TrendingProjectJson[]
}

export type IpfsCacheData = {
  [IpfsCacheName.trending]: TrendingProject[]
  [IpfsCacheName.trendingV2]: TrendingProject[]
}
