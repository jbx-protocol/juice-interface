import { Trans } from '@lingui/macro'
import { useSuckers } from 'juice-sdk-react'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { forwardRef } from 'react'
import { CycleNavigator } from './components/CycleNavigator'
import { useCyclesPanelSelectedChain } from './contexts/CyclesPanelSelectedChainContext'
import { CyclesPanelSelectedCycleProvider, useCyclesPanelSelectedCycle } from './contexts/CyclesPanelSelectedCycleContext'
import { V4V5CycleSubPanel } from './V4V5CycleSubPanel'

const V4V5CyclesPayoutsPanelContent = forwardRef<HTMLDivElement>((props, ref) => {
  const {
    cycleOptions,
    selectedCycleNumber,
    selectedCycleStatus,
    canGoNext,
    canGoPrevious,
    totalCycles,
    hasMoreRulesets,
    isLoadingMore,
    goToNextCycle,
    goToPreviousCycle,
    jumpToCycle,
    loadMoreRulesets,
    isLoading,
  } = useCyclesPanelSelectedCycle()

  const { selectedChainId, setSelectedChainId } = useCyclesPanelSelectedChain()
  const { data: suckers } = useSuckers()

  return (
    <div ref={ref} className="relative flex w-full flex-col gap-5">
      {/* Row 1: Title + Chain selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="mb-0 font-heading text-2xl font-medium">
            <Trans>Rulesets</Trans>
          </h2>
          {selectedChainId && suckers && suckers.length > 1 && (
            <ChainSelect
              value={selectedChainId}
              onChange={chainId => setSelectedChainId(chainId)}
              chainIds={suckers.map(s => s.peerChainId)}
            />
          )}
        </div>
      </div>

      {/* Row 2: Cycle Navigator */}
      {!isLoading && cycleOptions.length > 0 && (
        <CycleNavigator
          cycleOptions={cycleOptions}
          selectedCycleNumber={selectedCycleNumber}
          selectedCycleStatus={selectedCycleStatus}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          totalCycles={totalCycles}
          hasMoreRulesets={hasMoreRulesets}
          isLoadingMore={isLoadingMore}
          onGoNext={goToNextCycle}
          onGoPrevious={goToPreviousCycle}
          onJumpToCycle={jumpToCycle}
          onLoadMore={loadMoreRulesets}
        />
      )}

      {/* Cycle content */}
      <V4V5CycleSubPanel />
    </div>
  )
})

V4V5CyclesPayoutsPanelContent.displayName = 'V4V5CyclesPayoutsPanelContent'

export const V4V5CyclesPayoutsPanel = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <CyclesPanelSelectedCycleProvider>
      <V4V5CyclesPayoutsPanelContent ref={ref} {...props} />
    </CyclesPanelSelectedCycleProvider>
  )
})

V4V5CyclesPayoutsPanel.displayName = 'V4V5CyclesPayoutsPanel'
