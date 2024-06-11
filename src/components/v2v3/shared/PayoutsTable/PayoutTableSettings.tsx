import { ReceiptPercentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { ConvertAmountsModal } from 'components/Create/components/pages/PayoutsPage/components/ConvertAmountsModal'
import { PopupMenu, PopupMenuItem } from 'components/ui/PopupMenu'
import { handleConfirmationDeletion } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/modals'
import { useState } from 'react'
import { ReduxDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { fromWad } from 'utils/format/formatNumber'
import { usePayoutsTable } from './hooks/usePayoutsTable'
import { SwitchToUnlimitedModal } from './modals/SwitchToUnlimitedModal'

export const payoutsTableMenuItemsLabelClass = 'flex gap-2 items-center text-sm'
export const payoutsTableMenuItemsIconClass = 'h-5 w-5'

export function PayoutTableSettings() {
  const [switchToUnlimitedModalOpen, setSwitchToUnlimitedModalOpen] =
    useState<boolean>(false)
  const [switchToLimitedModalOpen, setSwitchToLimitedModalOpen] =
    useState<boolean>(false)

  const {
    payoutSplits,
    distributionLimitIsInfinite,
    handleDeleteAllPayoutSplits,
    setDistributionLimit,
    setCurrency,
    setSplits100Percent,
  } = usePayoutsTable()

  const handleSwitchToLimitedPayouts = (newLimit: ReduxDistributionLimit) => {
    setDistributionLimit(parseFloat(fromWad(newLimit.amount)))
    setCurrency(newLimit.currency)
    setSwitchToLimitedModalOpen(false)
  }

  const handleSwitchToUnlimitedPayouts = () => {
    setDistributionLimit(undefined)
    setSplits100Percent()
    setSwitchToUnlimitedModalOpen(false)
  }

  let menuItems: PopupMenuItem[] = []

  if (distributionLimitIsInfinite) {
    menuItems = [
      ...menuItems,
      {
        id: 'limited',
        label: (
          <div className={payoutsTableMenuItemsLabelClass}>
            <ReceiptPercentIcon className={payoutsTableMenuItemsIconClass} />
            <Trans>Switch to limited</Trans>
          </div>
        ),
        onClick: () => setSwitchToLimitedModalOpen(true),
      },
    ]
  } else {
    menuItems = [
      ...menuItems,
      {
        id: 'unlimited',
        label: (
          <div className={payoutsTableMenuItemsLabelClass}>
            <ReceiptPercentIcon className={payoutsTableMenuItemsIconClass} />
            <Trans>Switch to unlimited</Trans>
          </div>
        ),
        onClick: () => setSwitchToUnlimitedModalOpen(true),
      },
    ]
  }

  if (payoutSplits.length > 0) {
    menuItems = [
      ...menuItems,
      {
        id: 'delete',
        label: (
          <div className={payoutsTableMenuItemsLabelClass}>
            <TrashIcon className={payoutsTableMenuItemsIconClass} />
            <Trans>Delete all</Trans>
          </div>
        ),
        onClick: handleConfirmationDeletion({
          type: 'all payout recipients',
          onConfirm: handleDeleteAllPayoutSplits,
        }),
      },
    ]
  }

  return (
    <>
      <PopupMenu items={menuItems} popupClassName="w-52" />
      <SwitchToUnlimitedModal
        open={switchToUnlimitedModalOpen}
        onClose={() => setSwitchToUnlimitedModalOpen(false)}
        onOk={handleSwitchToUnlimitedPayouts}
      />
      <ConvertAmountsModal
        open={switchToLimitedModalOpen}
        onOk={handleSwitchToLimitedPayouts}
        onCancel={() => setSwitchToLimitedModalOpen(false)}
        splits={payoutSplits}
      />
    </>
  )
}
