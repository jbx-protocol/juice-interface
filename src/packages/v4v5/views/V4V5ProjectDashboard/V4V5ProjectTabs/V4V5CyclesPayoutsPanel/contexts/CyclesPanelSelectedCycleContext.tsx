import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { createContext, useContext } from 'react'
import {
  CycleOption,
  CycleStatus,
  useJBRulesetHistory,
} from 'packages/v4v5/hooks/useJBRulesetHistory'

type CyclesPanelSelectedCycleContextType = {
  // Selected cycle data
  selectedRuleset: JBRulesetData | undefined
  selectedRulesetMetadata: JBRulesetMetadata | undefined
  selectedCycleNumber: number | null
  selectedCycleStatus: CycleStatus

  // Previous cycle for diff
  previousRuleset: JBRulesetData | undefined
  previousRulesetMetadata: JBRulesetMetadata | undefined

  // Current cycle reference
  currentRuleset: JBRulesetData | undefined
  currentRulesetMetadata: JBRulesetMetadata | undefined
  currentCycleNumber: number | undefined

  // Upcoming cycle
  upcomingRuleset: JBRulesetData | undefined
  upcomingRulesetMetadata: JBRulesetMetadata | undefined
  hasUpcoming: boolean

  // Navigation
  cycleOptions: CycleOption[]
  canGoNext: boolean
  canGoPrevious: boolean
  goToNextCycle: () => void
  goToPreviousCycle: () => void
  jumpToCycle: (cycleNumber: number) => void
  goToCurrent: () => void
  totalCycles: number

  // Loading states
  isLoading: boolean
  isLoadingMore: boolean
  hasMoreRulesets: boolean
  loadMoreRulesets: () => void
}

const defaultContext: CyclesPanelSelectedCycleContextType = {
  selectedRuleset: undefined,
  selectedRulesetMetadata: undefined,
  selectedCycleNumber: null,
  selectedCycleStatus: 'current',
  previousRuleset: undefined,
  previousRulesetMetadata: undefined,
  currentRuleset: undefined,
  currentRulesetMetadata: undefined,
  currentCycleNumber: undefined,
  upcomingRuleset: undefined,
  upcomingRulesetMetadata: undefined,
  hasUpcoming: false,
  cycleOptions: [],
  canGoNext: false,
  canGoPrevious: false,
  goToNextCycle: () => {},
  goToPreviousCycle: () => {},
  jumpToCycle: () => {},
  goToCurrent: () => {},
  totalCycles: 0,
  isLoading: false,
  isLoadingMore: false,
  hasMoreRulesets: false,
  loadMoreRulesets: () => {},
}

export const CyclesPanelSelectedCycleContext =
  createContext<CyclesPanelSelectedCycleContextType>(defaultContext)

export const CyclesPanelSelectedCycleProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const rulesetHistory = useJBRulesetHistory()

  return (
    <CyclesPanelSelectedCycleContext.Provider value={rulesetHistory}>
      {children}
    </CyclesPanelSelectedCycleContext.Provider>
  )
}

export const useCyclesPanelSelectedCycle = () => {
  const context = useContext(CyclesPanelSelectedCycleContext)
  if (!context) {
    throw new Error(
      'useCyclesPanelSelectedCycle must be used within a CyclesPanelSelectedCycleProvider',
    )
  }
  return context
}
