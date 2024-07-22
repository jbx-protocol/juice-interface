import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useJBRuleset } from 'juice-sdk-react'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { useV4ExportSplitsToCsv } from '../V4CyclesPayoutsPanel/hooks/useV4ExportSplitsToCsv'

export const V4ExportReservedTokensCsvItem = () => {
  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: ruleset } = useJBRuleset()
  const { exportSplitsToCsv } = useV4ExportSplitsToCsv(
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
