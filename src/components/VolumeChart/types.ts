export type ProjectTLRange = 7 | 30 | 365 // days

export type ProjectTLView = 'trendingScore' | 'balance' | 'volume'

export type ProjectTLPoint = {
  timestamp: number
} & {
  [k in ProjectTLView]: number
}
