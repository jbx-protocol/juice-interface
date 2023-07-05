import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
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
  const { exportSplitsToCsv } = useExportSplitsToCsv(
    payoutSplits ?? [],
    'payouts',
    fcNumber,
  )

  if (!loading && !payoutSplits?.length) return null

  return (
    <Button
      type="text"
      loading={loading}
      className={twMerge(
        'flex h-auto gap-2 p-4',
        loading && 'cursor-not-allowed',
      )}
      style={{ color: 'inherit' }}
      onClick={exportSplitsToCsv}
    >
      <ArrowUpTrayIcon className="h-5 w-5" />
      <span className="whitespace-nowrap text-sm font-medium">
        <Trans>Export payouts CSV</Trans>
      </span>
    </Button>
  )
}
