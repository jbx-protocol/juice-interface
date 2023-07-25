import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { PopupMenu } from 'components/ui/PopupMenu'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useExportSplitsToCsv } from 'hooks/useExportSplitsToCsv'
import { useContext } from 'react'

export const ReservedTokensPopupMenu = () => {
  const { reservedTokensSplits } = useProjectContext()
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { exportSplitsToCsv } = useExportSplitsToCsv(
    reservedTokensSplits ?? [],
    'reserved-tokens',
    fundingCycle?.number.toNumber(),
  )
  if (!reservedTokensSplits) return null
  return (
    <PopupMenu
      items={[
        {
          id: 'export',
          label: (
            <>
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span className="whitespace-nowrap text-sm font-medium">
                <Trans>Export tokens CSV</Trans>
              </span>
            </>
          ),
          onClick: exportSplitsToCsv,
        },
      ]}
    />
  )
}
