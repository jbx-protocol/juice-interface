import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useExportSplitsToCsv } from 'hooks/useExportSplitsToCsv'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { useCurrentUpcomingPayoutSplits } from '../hooks/useCurrentUpcomingPayoutSplits'

export const ExportPayoutsCsvItem = ({
  type,
}: {
  type: 'current' | 'upcoming'
}) => {
  const { splits: payoutSplits, loading } = useCurrentUpcomingPayoutSplits(type)
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const fcNumber = fundingCycle
    ? type === 'current'
      ? Number(fundingCycle.number)
      : Number(fundingCycle.number) + 1
    : undefined
  const disabled = !payoutSplits?.length
  const { exportSplitsToCsv } = useExportSplitsToCsv(
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
          (loading || disabled) && 'cursor-not-allowed',
        )}
        type="text"
        loading={loading}
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
