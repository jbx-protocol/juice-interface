export type Duration = 1 | 7 | 30 | 90 | 365

export type EventRef = {
  timestamp: number
  value?: number
  tapped?: number
  previousBalance?: number
}

export type BlockRef = { block: number | null; timestamp: number }

export type ShowGraph = 'volume' | 'balance'
