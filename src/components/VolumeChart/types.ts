export type ProjectTimelineRange = 7 | 30 | 365 // days

export type ProjectTimelineView = 'trendingScore' | 'balance' | 'volume'

export type ProjectTimelinePoint = {
  timestamp: number
} & {
  [k in ProjectTimelineView]: number
}
