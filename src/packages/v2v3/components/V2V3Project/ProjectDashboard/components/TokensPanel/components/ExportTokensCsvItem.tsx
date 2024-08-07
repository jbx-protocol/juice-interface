import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useExportSplitsToCsv } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useExportSplitsToCsv'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'

export const ExportTokensCsvItem = () => {
  const { reservedTokensSplits } = useProjectContext()
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { exportSplitsToCsv } = useExportSplitsToCsv(
    reservedTokensSplits ?? [],
    'reserved-tokens',
    fundingCycle?.number.toNumber(),
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
