import { Trans, t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { ProjectAllocationRow } from '../../ProjectAllocationRow/ProjectAllocationRow'
import { TitleDescriptionDisplayCard } from '../../ui/TitleDescriptionDisplayCard'
import { usePayoutsSubPanel } from '../hooks/usePayoutsSubPanel'
import { ExportPayoutsCsvItem } from './ExportPayoutsCsvItem'
import { SendPayoutsButton } from './SendPayoutsButton'
import { TreasuryStats } from './TreasuryStats'

export const PayoutsSubPanel = ({
  className,
  type,
}: {
  className?: string
  type: 'current' | 'upcoming'
}) => {
  const { payouts, loading, totalPayoutAmount } = usePayoutsSubPanel(type)
  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Treasury & Payouts</Trans>
      </h2>
      <div className="mt-5 flex flex-col items-center gap-4">
        {type === 'current' && <TreasuryStats />}

        <TitleDescriptionDisplayCard
          className="w-full"
          title={t`Payouts`}
          description={totalPayoutAmount}
          kebabMenu={{
            items: [
              {
                id: 'export',
                component: <ExportPayoutsCsvItem type={type} />,
              },
            ],
          }}
        >
          <div className="mt-4 w-full">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <ProjectAllocationSkeleton key={i} />
              ))
            ) : payouts?.length ? (
              payouts.map(payout => (
                <ProjectAllocationRow
                  key={`${payout.address}${payout.projectId}`}
                  {...payout}
                />
              ))
            ) : (
              <span className="font-heading text-xl font-medium dark:text-slate-50">
                <Trans>None</Trans>
              </span>
            )}
          </div>
          {!!payouts?.length && type === 'current' && (
            <SendPayoutsButton
              className="z-0 mt-6 w-full justify-center md:w-auto"
              containerClassName="md:self-end"
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
