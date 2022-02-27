import { TrendingProject } from 'models/subgraph-entities/project'

export type SerializedTrendingProject = Pick<
  TrendingProject,
  'createdAt' | 'trendingPaymentsCount' | 'handle' | 'uri' | 'terminal'
> & {
  id: string
  trendingVolume: string
  trendingScore: string
  totalPaid: string
}
