import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePastFundingCycles } from '../hooks/usePastFundingCycles'
import HistoricalCycle from './HistoricalCycle'

export const HistorySubPanel = () => {
  const { projectId } = useProjectMetadataContext()
  const { fundingCycle } = useProjectContext()

  const [isFetchingMore, setIsFetchingMore] = useState<boolean>()
  const { data, fetchMore, loading, error } = usePastFundingCycles({
    projectId,
    currentFcNumber: fundingCycle?.number.toNumber() ?? 0,
  })

  const isLoading = loading || isFetchingMore

  const tableHeaders = [t`Cycle #`, t`Withdrawn`, t`Date`]
  const hasMore =
    data?.fundingCycles.length &&
    data.fundingCycles[data.fundingCycles.length - 1].number > 1

  return data?.fundingCycles.length || isLoading ? (
    <div className="grid min-w-full grid-cols-1">
      <div className="rounded-t-lg bg-smoke-50 p-4 pr-2 dark:bg-slate-700">
        <div className="grid grid-cols-config-table gap-3">
          {tableHeaders.map(header => (
            <div
              key={header}
              className={twMerge('text-start text-sm font-semibold')}
            >
              {header}
            </div>
          ))}
          <div className="relative w-6 min-w-[24px] py-2.5">
            <span className="sr-only">View</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-grey-200 dark:divide-slate-500">
        {error ? (
          <div className="text-error-400">{error.message}</div>
        ) : (
          <>
            {data?.fundingCycles.map((cycle, index) => (
              <HistoricalCycle {...cycle} key={index} />
            ))}
            {isLoading ? (
              <LoadingState />
            ) : (
              hasMore && (
                <Button
                  type="link"
                  onClick={() => {
                    setIsFetchingMore(true)
                    fetchMore({
                      variables: {
                        skip: data?.fundingCycles.length + 1,
                      },
                    }).finally(() => setIsFetchingMore(false))
                  }}
                >
                  <Trans>Load more</Trans>
                </Button>
              )
            )}
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="text-grey-500 dark:text-slate-200">
      <Trans>No previous cycles.</Trans>
    </div>
  )
}

const LoadingState = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </>
)

const SkeletonRow = () => (
  <div className="p-4 pr-2">
    <div className="grid animate-pulse grid-cols-config-table bg-white dark:bg-slate-950">
      <div className="whitespace-nowrap text-sm font-medium">
        <div className="h-4 w-14 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="whitespace-nowrap text-sm font-medium">
        <div className="h-4 w-24 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="whitespace-nowrap text-sm text-grey-500">
        <div className="h-4 w-20 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="relative w-6 min-w-[24px] py-2.5"></div>
    </div>
  </div>
)
