import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useJBRuleset } from 'juice-sdk-react'
import { twMerge } from 'tailwind-merge'
import { useV4CurrentUpcomingPayoutSplits } from './hooks/useV4CurrentUpcomingPayoutSplits'
import { useV4ExportSplitsToCsv } from './hooks/useV4ExportSplitsToCsv'

export const V4ExportPayoutsCsvItem = ({
  type,
}: {
  type: 'current' | 'upcoming'
}) => {
  const { splits: payoutSplits, isLoading } = useV4CurrentUpcomingPayoutSplits(type)
  const { data: ruleset } = useJBRuleset()
  const fcNumber = ruleset
    ? type === 'current'
      ? Number(ruleset.cycleNumber)
      : Number(ruleset.cycleNumber) + 1
    : undefined
  const disabled = !payoutSplits?.length
  const { exportSplitsToCsv } = useV4ExportSplitsToCsv(
    payoutSplits ?? [],
    'payouts',
    fcNumber,
  )

  return (
    <Tooltip
      title={t`No payouts to export`}
      open={disabled ? undefined : false}
    >
      <Button
        className={twMerge(
          'flex h-auto gap-2 p-4',
          (isLoading || disabled) && 'cursor-not-allowed',
        )}
        type="text"
        loading={isLoading}
        style={{ color: 'inherit' }}
        onClick={!disabled ? exportSplitsToCsv : e => e.preventDefault()}
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
        <span className="whitespace-nowrap text-sm font-medium">
          <Trans>Export payouts CSV</Trans>
        </span>
      </Button>
    </Tooltip>
  )
}
