import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useExportSplitsToCsv } from 'hooks/useExportSplitsToCsv'
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
      ? fundingCycle.number.toNumber()
      : fundingCycle.number.toNumber() + 1
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
