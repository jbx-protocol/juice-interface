import {
  ArrowUpCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'
import { ProjectAllocationRow } from '../../ProjectAllocationRow/ProjectAllocationRow'
import { DisplayCard } from '../../ui'
import { usePayoutsSubPanel } from '../hooks/usePayoutsSubPanel'

export const PayoutsSubPanel = ({ className }: { className?: string }) => {
  const { payouts, treasuryBalance, availableToPayout, overflow } =
    usePayoutsSubPanel()
  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Treasury & Payouts</Trans>
      </h2>
      {payouts?.length ? (
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex w-full items-center gap-4">
            <DisplayCard className="flex w-full flex-col gap-2">
              <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
                <Trans>Treasury balance</Trans>
              </h3>
              <span className="font-heading text-xl font-medium">
                {treasuryBalance}
              </span>
            </DisplayCard>
            <DisplayCard className="flex w-full flex-col gap-2">
              <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
                <Trans>Overflow</Trans>
              </h3>
              <span className="font-heading text-xl font-medium">
                {overflow}
              </span>
            </DisplayCard>
            <DisplayCard className="flex w-full flex-col gap-2">
              <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
                <Trans>Available to pay out</Trans>
              </h3>
              <span className="font-heading text-xl font-medium">
                {availableToPayout}
              </span>
            </DisplayCard>
          </div>
          <DisplayCard className="flex w-full flex-col pb-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
                <Trans>Payouts</Trans>
              </h3>
              <EllipsisVerticalIcon role="button" className="h-6 w-6" />
            </div>

            <div className="mt-4 w-full">
              {payouts
                ? payouts.map(payout => (
                    <ProjectAllocationRow key={payout.address} {...payout} />
                  ))
                : null}
            </div>

            <Button
              type="primary"
              className="mt-6 flex w-fit items-center gap-3 self-end"
            >
              <Trans>Send payouts</Trans>
              <ArrowUpCircleIcon className="h-5 w-5" />
            </Button>
          </DisplayCard>
        </div>
      ) : (
        <div className="mt-5 text-grey-500 dark:text-slate-200">
          <Trans>No payouts for the cycle.</Trans>
        </div>
      )}
    </div>
  )
}
