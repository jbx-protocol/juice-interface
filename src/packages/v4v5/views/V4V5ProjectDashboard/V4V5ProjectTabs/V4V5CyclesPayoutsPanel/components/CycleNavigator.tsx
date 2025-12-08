import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { CycleOption, CycleStatus } from 'packages/v4v5/hooks/useJBRulesetHistory'

type CycleNavigatorProps = {
  cycleOptions: CycleOption[]
  selectedCycleNumber: number | null
  selectedCycleStatus: CycleStatus
  canGoNext: boolean
  canGoPrevious: boolean
  totalCycles: number
  hasMoreRulesets: boolean
  isLoadingMore: boolean
  onGoNext: () => void
  onGoPrevious: () => void
  onJumpToCycle: (cycleNumber: number) => void
  onLoadMore: () => void
}

function CycleStatusBadge({ status }: { status: CycleStatus }) {
  const badgeStyles = {
    current: 'bg-bluebs-100 text-bluebs-700 dark:bg-bluebs-900 dark:text-bluebs-300',
    upcoming: 'bg-melon-100 text-melon-700 dark:bg-melon-900 dark:text-melon-300',
    past: 'bg-smoke-200 text-smoke-700 dark:bg-slate-600 dark:text-slate-300',
  }

  const statusText = {
    current: t`Current`,
    upcoming: t`Upcoming`,
    past: t`Past`,
  }

  return (
    <span
      className={twMerge(
        'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
        badgeStyles[status],
      )}
    >
      {statusText[status]}
    </span>
  )
}

function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatCycleDateRange(start: number, duration: number): string {
  const startDate = formatShortDate(start)
  if (duration === 0) {
    return startDate
  }
  const endDate = formatShortDate(start + duration)
  return `${startDate} - ${endDate}`
}

export function CycleNavigator({
  cycleOptions,
  selectedCycleNumber,
  selectedCycleStatus,
  canGoNext,
  canGoPrevious,
  totalCycles,
  hasMoreRulesets,
  isLoadingMore,
  onGoNext,
  onGoPrevious,
  onJumpToCycle,
  onLoadMore,
}: CycleNavigatorProps) {
  const selectedOption = useMemo(() => {
    const option = cycleOptions.find(opt => opt.cycleNumber === selectedCycleNumber)
    if (!option) return null
    return option
  }, [cycleOptions, selectedCycleNumber])

  const dropdownOptions = useMemo(() => {
    const options = cycleOptions.map(option => ({
      label: (
        <span className="flex items-center justify-between gap-2">
          <span>
            <Trans>Cycle #{option.cycleNumber}</Trans>
          </span>
          <CycleStatusBadge status={option.status} />
        </span>
      ),
      value: option.cycleNumber,
    }))

    // Add "Load more" option if available
    if (hasMoreRulesets) {
      options.push({
        label: (
          <span className="text-bluebs-500 dark:text-bluebs-400">
            {isLoadingMore ? <Trans>Loading...</Trans> : <Trans>Load more cycles...</Trans>}
          </span>
        ),
        value: -1, // Special value for load more
      })
    }

    return options
  }, [cycleOptions, hasMoreRulesets, isLoadingMore])

  const currentValue = useMemo(() => {
    if (!selectedOption) return { label: t`Select cycle`, value: undefined }
    return {
      label: (
        <span className="flex items-center">
          <Trans>Cycle #{selectedOption.cycleNumber}</Trans>
          <CycleStatusBadge status={selectedOption.status} />
        </span>
      ),
      value: selectedOption.cycleNumber,
    }
  }, [selectedOption])

  const handleDropdownChange = (option: { value: number | undefined }) => {
    if (option.value === -1) {
      onLoadMore()
      return
    }
    if (option.value !== undefined) {
      onJumpToCycle(option.value)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          type="button"
          onClick={onGoPrevious}
          disabled={!canGoPrevious}
          className={twMerge(
            'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
            canGoPrevious
              ? 'border-smoke-300 bg-smoke-50 text-grey-700 hover:bg-smoke-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              : 'cursor-not-allowed border-smoke-200 bg-smoke-50 text-grey-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500',
          )}
          aria-label={t`Previous cycle`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* Cycle selector dropdown */}
        <JuiceListbox
          className="flex-1"
          buttonClassName="w-full justify-center"
          value={currentValue}
          onChange={handleDropdownChange}
          options={dropdownOptions}
        />

        {/* Next button */}
        <button
          type="button"
          onClick={onGoNext}
          disabled={!canGoNext}
          className={twMerge(
            'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
            canGoNext
              ? 'border-smoke-300 bg-smoke-50 text-grey-700 hover:bg-smoke-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              : 'cursor-not-allowed border-smoke-200 bg-smoke-50 text-grey-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500',
          )}
          aria-label={t`Next cycle`}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Date range display */}
      {selectedOption && (
        <div className="text-center text-sm text-grey-500 dark:text-slate-400">
          {selectedOption.duration === 0 ? (
            <span>
              <Trans>Started {formatShortDate(selectedOption.start)}</Trans>
            </span>
          ) : (
            <span>{formatCycleDateRange(selectedOption.start, selectedOption.duration)}</span>
          )}
          {totalCycles > 0 && (
            <span className="ml-2 text-grey-400 dark:text-slate-500">
              ({selectedCycleNumber} of {totalCycles})
            </span>
          )}
        </div>
      )}
    </div>
  )
}
