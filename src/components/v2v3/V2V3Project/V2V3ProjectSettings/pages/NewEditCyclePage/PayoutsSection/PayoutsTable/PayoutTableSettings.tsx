import { ReceiptPercentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { handleConfirmationDeletion } from 'components/ProjectDashboard/utils/modals'
import { PopupMenu, PopupMenuItem } from 'components/ui/PopupMenu'
import { useState } from 'react'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { SwitchToLimitedModal } from './modals/SwitchToLimitedModal'
import { SwitchToUnlimitedModal } from './modals/SwitchToUnlimitedModal'

export function PayoutTableSettings() {
  const [switchToUnlimitedModalOpen, setSwitchToUnlimitedModalOpen] =
    useState<boolean>(false)
  const [switchToLimitedModalOpen, setSwitchToLimitedModalOpen] =
    useState<boolean>(false)

  const {
    payoutSplits,
    distributionLimitIsInfinite,
    handleDeleteAllPayoutSplits,
  } = usePayoutsTable()

  const menuItemsLabelClass = 'flex gap-2 items-center text-sm'
  const menuItemsIconClass = 'h-5 w-5'
  let menuItems: PopupMenuItem[] = []

  if (distributionLimitIsInfinite) {
    menuItems = [
      ...menuItems,
      {
        id: 'limited',
        label: (
          <div className={menuItemsLabelClass}>
            <ReceiptPercentIcon className={menuItemsIconClass} />
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
          <div className={menuItemsLabelClass}>
            <ReceiptPercentIcon className={menuItemsIconClass} />
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
          <div className={menuItemsLabelClass}>
            <TrashIcon className={menuItemsIconClass} />
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
      />
      <SwitchToLimitedModal
        open={switchToLimitedModalOpen}
        onClose={() => setSwitchToLimitedModalOpen(false)}
      />
    </>
  )
}
