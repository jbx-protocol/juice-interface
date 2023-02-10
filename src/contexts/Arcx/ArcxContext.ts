import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'
import { createContext } from 'react'

export const ArcxContext = createContext<ArcxAnalyticsSdk | undefined>(
  undefined,
)
