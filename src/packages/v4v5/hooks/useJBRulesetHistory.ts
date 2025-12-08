import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { useJBProjectId, useJBRuleset } from 'juice-sdk-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useJBAllRulesetsCrossChain, RulesetWithMetadata } from './useJBAllRulesetsCrossChain'
import { useJBUpcomingRuleset } from './useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5CyclesPayoutsPanel/contexts/CyclesPanelSelectedChainContext'

export type CycleStatus = 'current' | 'upcoming' | 'past'

export type CycleOption = {
  cycleNumber: number
  status: CycleStatus
  start: number
  duration: number
}

export type RulesetDiff = {
  field: string
  current: unknown
  previous: unknown
}

const INITIAL_LOAD_SIZE = 20n
const LOAD_MORE_SIZE = 10n

export function useJBRulesetHistory() {
  const { selectedChainId } = useCyclesPanelSelectedChain()
  const { projectId } = useJBProjectId(selectedChainId)

  const [selectedCycleNumber, setSelectedCycleNumber] = useState<number | null>(null)
  const [loadedRulesets, setLoadedRulesets] = useState<RulesetWithMetadata[]>([])
  const [hasMoreRulesets, setHasMoreRulesets] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState(false)

  // Get current ruleset
  const {
    ruleset: currentRuleset,
    rulesetMetadata: currentRulesetMetadata,
    isLoading: currentRulesetLoading,
  } = useJBRuleset({
    chainId: selectedChainId,
    projectId,
  })

  // Get upcoming ruleset
  const {
    ruleset: upcomingRuleset,
    rulesetMetadata: upcomingRulesetMetadata,
    isLoading: upcomingRulesetLoading,
  } = useJBUpcomingRuleset(selectedChainId)

  // Use the ruleset ID (not cycleNumber) for fetching historical rulesets
  // The allRulesetsOf contract method takes startingId which is the ruleset.id
  const currentRulesetId = currentRuleset?.id ?? 0

  // Fetch historical rulesets starting from current ruleset ID (going backwards)
  const { data: historicalRulesets, isLoading: historicalRulesetsLoading } =
    useJBAllRulesetsCrossChain({
      projectId: BigInt(projectId ?? 0),
      startingId: BigInt(currentRulesetId || 1),
      chainId: selectedChainId!,
      size: INITIAL_LOAD_SIZE,
    })

  // Initialize loaded rulesets when historical data is fetched (only once)
  useEffect(() => {
    if (historicalRulesets && historicalRulesets.length > 0 && !historicalDataLoaded) {
      setLoadedRulesets(historicalRulesets)
      setHistoricalDataLoaded(true)
      // If we got fewer rulesets than requested, there are no more to load
      setHasMoreRulesets(historicalRulesets.length >= Number(INITIAL_LOAD_SIZE))
    }
  }, [historicalRulesets, historicalDataLoaded])

  // Set default selected cycle to current when data loads
  useEffect(() => {
    if (currentRuleset && selectedCycleNumber === null) {
      setSelectedCycleNumber(currentRuleset.cycleNumber)
    }
  }, [currentRuleset, selectedCycleNumber])

  // Determine if upcoming ruleset is different from current
  const hasUpcoming = useMemo(() => {
    if (!upcomingRuleset || !currentRuleset) return false
    return upcomingRuleset.cycleNumber > currentRuleset.cycleNumber
  }, [upcomingRuleset, currentRuleset])

  // Build the list of available cycles for the dropdown
  const cycleOptions = useMemo((): CycleOption[] => {
    const options: CycleOption[] = []

    // Add upcoming if available
    if (hasUpcoming && upcomingRuleset) {
      options.push({
        cycleNumber: upcomingRuleset.cycleNumber,
        status: 'upcoming',
        start: upcomingRuleset.start,
        duration: upcomingRuleset.duration,
      })
    }

    // Add current
    if (currentRuleset) {
      options.push({
        cycleNumber: currentRuleset.cycleNumber,
        status: 'current',
        start: currentRuleset.start,
        duration: currentRuleset.duration,
      })
    }

    // Add historical from loaded rulesets (skip current as it's already added)
    loadedRulesets.forEach(({ ruleset }) => {
      if (ruleset.cycleNumber < (currentRuleset?.cycleNumber ?? 0)) {
        options.push({
          cycleNumber: ruleset.cycleNumber,
          status: 'past',
          start: ruleset.start,
          duration: ruleset.duration,
        })
      }
    })

    // Sort by cycle number descending (newest first)
    return options.sort((a, b) => b.cycleNumber - a.cycleNumber)
  }, [hasUpcoming, upcomingRuleset, currentRuleset, loadedRulesets])

  // Get the currently selected ruleset data
  const selectedRuleset = useMemo((): {
    ruleset: JBRulesetData | undefined
    metadata: JBRulesetMetadata | undefined
    status: CycleStatus
  } => {
    if (!selectedCycleNumber) {
      return { ruleset: undefined, metadata: undefined, status: 'current' }
    }

    // Check if it's upcoming
    if (hasUpcoming && upcomingRuleset?.cycleNumber === selectedCycleNumber) {
      return {
        ruleset: upcomingRuleset,
        metadata: upcomingRulesetMetadata,
        status: 'upcoming',
      }
    }

    // Check if it's current
    if (currentRuleset?.cycleNumber === selectedCycleNumber) {
      return {
        ruleset: currentRuleset,
        metadata: currentRulesetMetadata,
        status: 'current',
      }
    }

    // Find in historical
    const historical = loadedRulesets.find(
      r => r.ruleset.cycleNumber === selectedCycleNumber,
    )
    if (historical) {
      return {
        ruleset: historical.ruleset,
        metadata: historical.metadata,
        status: 'past',
      }
    }

    return { ruleset: undefined, metadata: undefined, status: 'past' }
  }, [
    selectedCycleNumber,
    hasUpcoming,
    upcomingRuleset,
    upcomingRulesetMetadata,
    currentRuleset,
    currentRulesetMetadata,
    loadedRulesets,
  ])

  // Get the previous ruleset for diff comparison
  const previousRuleset = useMemo((): RulesetWithMetadata | undefined => {
    if (!selectedCycleNumber) return undefined

    // Find the ruleset with cycle number - 1
    const prevCycleNumber = selectedCycleNumber - 1
    if (prevCycleNumber < 1) return undefined

    // Check if it's in loaded rulesets
    return loadedRulesets.find(r => r.ruleset.cycleNumber === prevCycleNumber)
  }, [selectedCycleNumber, loadedRulesets])

  // Load more historical rulesets
  const loadMoreRulesets = useCallback(async () => {
    if (!hasMoreRulesets || isLoadingMore || loadedRulesets.length === 0) return

    setIsLoadingMore(true)

    // Find the oldest loaded ruleset
    const oldestCycle = Math.min(...loadedRulesets.map(r => r.ruleset.cycleNumber))

    if (oldestCycle <= 1) {
      setHasMoreRulesets(false)
      setIsLoadingMore(false)
      return
    }

    // Note: In a real implementation, you'd need to use a separate query here
    // For now, we indicate that more can be loaded but the actual loading
    // would require adjusting the hook to support dynamic fetching
    setIsLoadingMore(false)
  }, [hasMoreRulesets, isLoadingMore, loadedRulesets])

  // Navigation functions
  const goToNextCycle = useCallback(() => {
    if (!selectedCycleNumber) return

    const currentIndex = cycleOptions.findIndex(
      opt => opt.cycleNumber === selectedCycleNumber,
    )
    if (currentIndex > 0) {
      setSelectedCycleNumber(cycleOptions[currentIndex - 1].cycleNumber)
    }
  }, [selectedCycleNumber, cycleOptions])

  const goToPreviousCycle = useCallback(() => {
    if (!selectedCycleNumber) return

    const currentIndex = cycleOptions.findIndex(
      opt => opt.cycleNumber === selectedCycleNumber,
    )
    if (currentIndex < cycleOptions.length - 1) {
      setSelectedCycleNumber(cycleOptions[currentIndex + 1].cycleNumber)
    }
  }, [selectedCycleNumber, cycleOptions])

  const jumpToCycle = useCallback((cycleNumber: number) => {
    setSelectedCycleNumber(cycleNumber)
  }, [])

  const goToCurrent = useCallback(() => {
    if (currentRuleset) {
      setSelectedCycleNumber(currentRuleset.cycleNumber)
    }
  }, [currentRuleset])

  // Determine if navigation is possible
  const canGoNext = useMemo(() => {
    if (!selectedCycleNumber) return false
    const currentIndex = cycleOptions.findIndex(
      opt => opt.cycleNumber === selectedCycleNumber,
    )
    return currentIndex > 0
  }, [selectedCycleNumber, cycleOptions])

  const canGoPrevious = useMemo(() => {
    if (!selectedCycleNumber) return false
    const currentIndex = cycleOptions.findIndex(
      opt => opt.cycleNumber === selectedCycleNumber,
    )
    return currentIndex < cycleOptions.length - 1
  }, [selectedCycleNumber, cycleOptions])

  const isLoading =
    currentRulesetLoading || upcomingRulesetLoading || historicalRulesetsLoading

  const totalCycles = currentRuleset?.cycleNumber ?? 0

  return {
    // Selected ruleset data
    selectedRuleset: selectedRuleset.ruleset,
    selectedRulesetMetadata: selectedRuleset.metadata,
    selectedCycleNumber,
    selectedCycleStatus: selectedRuleset.status,

    // Previous ruleset for diff
    previousRuleset: previousRuleset?.ruleset,
    previousRulesetMetadata: previousRuleset?.metadata,

    // Current ruleset reference
    currentRuleset,
    currentRulesetMetadata,
    currentCycleNumber: currentRuleset?.cycleNumber,

    // Upcoming ruleset
    upcomingRuleset: hasUpcoming ? upcomingRuleset : undefined,
    upcomingRulesetMetadata: hasUpcoming ? upcomingRulesetMetadata : undefined,
    hasUpcoming,

    // Navigation
    cycleOptions,
    canGoNext,
    canGoPrevious,
    goToNextCycle,
    goToPreviousCycle,
    jumpToCycle,
    goToCurrent,
    totalCycles,

    // Loading states
    isLoading,
    isLoadingMore,
    hasMoreRulesets,
    loadMoreRulesets,
  }
}
