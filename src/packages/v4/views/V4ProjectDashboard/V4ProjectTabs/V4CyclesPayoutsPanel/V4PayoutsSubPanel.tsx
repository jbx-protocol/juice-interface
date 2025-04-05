import { Trans, t } from '@lingui/macro'
import { availableToPayOutTooltip } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { TruncatedText } from 'components/TruncatedText'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import { NativeTokenValue } from 'juice-sdk-react'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { useV4PayoutsSubPanel } from './hooks/useV4PayoutsSubPanel'
import { useV4TreasuryStats } from './hooks/useV4TreasuryStats'
import { V4ExportPayoutsCsvItem } from './V4ExportPayoutsCsvItem'
import { V4ProjectAllocationRow } from './V4ProjectAllocationRow'
import { V4SendPayoutsButton } from './V4SendPayoutsButton'

export const V4PayoutsSubPanel = ({
  className,
  type,
}: {
  className?: string
  type: 'current' | 'upcoming'
}) => {
  const { payouts, isLoading, totalPayoutAmount, payoutLimit } =
    useV4PayoutsSubPanel(type)
  const {
    totalTreasuryBalance,
    suckersBalance,
    surplusElement,
    availableToPayout,
    cashOutTaxRate,
  } = useV4TreasuryStats()

  const surplusTooltip = React.useMemo(
    () =>
      cashOutTaxRate && cashOutTaxRate.toFloat() > 0 ? (
        <Trans>
          {surplusElement} is available across all chains for token redemptions
          or future payouts.
        </Trans>
      ) : (
        <Trans>
          {surplusElement} is available across all chains for future payouts.
        </Trans>
      ),
    [surplusElement, cashOutTaxRate],
  )

  const hasPayouts =
    !payouts || payouts.length === 0 || payoutLimit === 0n ? false : true

  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Treasury & Payouts</Trans>
      </h2>
      <div className="mt-5 flex flex-col items-center gap-4">
        {type === 'current' && (
          <>
            <TitleDescriptionDisplayCard
              className="w-full"
              title={t`Treasury balance`}
              description={totalTreasuryBalance}
            >
              <div className="mt-4 flex flex-col divide-y divide-grey-200 dark:divide-slate-600">
                {suckersBalance.length > 0 &&
                  suckersBalance.map(sucker => (
                    <div
                      key={sucker.chainId}
                      className="flex h-12 items-center justify-between gap-5"
                    >
                      <span className="flex items-center gap-3">
                        <ChainLogo chainId={sucker.chainId as JBChainId} />

                        <TruncatedText
                          className="text-sm font-medium text-grey-900 dark:text-slate-50"
                          text={NETWORKS[sucker.chainId].label}
                        />
                      </span>
                      <span className="flex-shrink-0 flex-nowrap text-sm text-grey-900 dark:text-slate-50">
                        <NativeTokenValue wei={sucker.balance} />
                      </span>
                    </div>
                  ))}
              </div>
            </TitleDescriptionDisplayCard>
            <div className="flex w-full flex-wrap items-center gap-4">
              <TitleDescriptionDisplayCard
                className="flex flex-1"
                title={t`Surplus`}
                description={surplusElement}
                tooltip={surplusTooltip}
              />
              <TitleDescriptionDisplayCard
                className="flex flex-1"
                title={t`Available to pay out`}
                description={availableToPayout}
                tooltip={availableToPayOutTooltip}
              />
            </div>
          </>
        )}

        <TitleDescriptionDisplayCard
          className="w-full"
          title={t`Payouts`}
          description={totalPayoutAmount}
          {...(hasPayouts
            ? {
                kebabMenu: {
                  items: [
                    {
                      id: 'export',
                      component: <V4ExportPayoutsCsvItem type={type} />,
                    },
                  ],
                },
              }
            : {})}
        >
          <div className="mt-4 w-full">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <ProjectAllocationSkeleton key={i} />
              ))
            ) : hasPayouts ? (
              payouts?.map((payout, i) => (
                <V4ProjectAllocationRow
                  key={`${payout.address}${payout.projectId}-${i}`}
                  {...payout}
                />
              ))
            ) : (
              <span className="font-heading text-xl font-medium dark:text-slate-50">
                <Trans>None</Trans>
              </span>
            )}
          </div>
          {hasPayouts && type === 'current' && (
            <V4SendPayoutsButton
              className="z-0 w-full justify-center md:w-auto"
              containerClassName="md:self-end mt-6 inline-flex"
            />
          )}
        </TitleDescriptionDisplayCard>
      </div>
    </div>
  )
}

const ProjectAllocationSkeleton = () => (
  <div className="flex items-center justify-between gap-3 py-3">
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-3 font-medium dark:text-slate-50">
        <span className="h-8 w-8 rounded-full bg-smoke-200 dark:bg-slate-500" />
        <span className="h-[22px] w-20 rounded-lg bg-smoke-200 dark:bg-slate-500" />
      </span>
    </div>
    <div className="flex items-center gap-3 dark:text-slate-200">
      <span className="h-[22px] w-28 rounded-lg bg-smoke-200 dark:bg-slate-500" />
    </div>
  </div>
)
