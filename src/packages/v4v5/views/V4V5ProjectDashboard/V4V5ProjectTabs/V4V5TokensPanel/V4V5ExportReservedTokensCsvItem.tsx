import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useJBProjectId, useJBRuleset } from 'juice-sdk-react'
import { useV4V5ReservedSplits } from 'packages/v4v5/hooks/useV4V5ReservedSplits'
import { useV4V5ExportSplitsToCsv } from '../V4V5CyclesPayoutsPanel/hooks/useV4V5ExportSplitsToCsv'

export const V4V5ExportReservedTokensCsvItem = () => {
  const { splits: reservedTokensSplits } = useV4V5ReservedSplits()
  const { projectId, chainId } = useJBProjectId()
  const { ruleset } = useJBRuleset({ projectId, chainId })
  const { exportSplitsToCsv } = useV4V5ExportSplitsToCsv(
    reservedTokensSplits ?? [],
    'reserved-tokens',
    Number(ruleset?.cycleNumber),
  )
  if (!reservedTokensSplits?.length) return null

  return (
    <span role="button" className="flex gap-2 p-4" onClick={exportSplitsToCsv}>
      <ArrowUpTrayIcon className="h-5 w-5" />
      <span className="whitespace-nowrap text-sm font-medium">
        <Trans>Export tokens CSV</Trans>
      </span>
    </span>
  )
}
