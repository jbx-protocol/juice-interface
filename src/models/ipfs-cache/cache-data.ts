import {
  TrendingProject,
  TrendingProjectJson,
} from 'models/subgraph-entities/project'

import { IpfsCacheName } from './cache-name'

export type IpfsCacheJsonData = {
  [IpfsCacheName.trending]: TrendingProjectJson[]
}

export type IpfsCacheData = {
  [IpfsCacheName.trending]: TrendingProject[]
}
