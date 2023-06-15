import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useCurrentUpcomingPayoutSplits } from 'components/ProjectDashboard/components/CyclesPayoutsPanel/hooks/useCurrentUpcomingPayoutSplits'
import { PopupMenu } from 'components/ProjectDashboard/components/PopupMenu/PopupMenu'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { useExportSplitsToCsv } from '../../../../../hooks/useExportSplitsToCsv'

export const PayoutsPopupMenu = ({
  type,
}: {
  type: 'current' | 'upcoming'
}) => {
  const { splits: payoutSplits } = useCurrentUpcomingPayoutSplits(type)
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
  if (!payoutSplits) return null
  return (
    <PopupMenu
      items={[
        {
          id: 'export',
          label: (
            <>
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span className="whitespace-nowrap text-sm font-medium">
                <Trans>Export payout CSV</Trans>
              </span>
            </>
          ),
          onClick: exportSplitsToCsv,
        },
      ]}
    />
  )
}
