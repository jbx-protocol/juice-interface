import { ReceiptPercentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { PopupMenu } from 'components/ui/PopupMenu'
import { useState } from 'react'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { DeleteAllPayoutsModal } from './modals/DeleteAllPayoutsModal'

export function PayoutTableSettings() {
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState<boolean>(false)

  const { payoutSplits } = usePayoutsTable()

  const menuItemsLabelClass = 'flex gap-2 items-center'
  const menuItemsIconClass = 'h-5 w-5'
  let menuItems = [
    {
      id: 'unlimited',
      label: (
        <div className={menuItemsLabelClass}>
          <ReceiptPercentIcon className={menuItemsIconClass} />
          <Trans>Switch to unlimited</Trans>
        </div>
      ),
      onClick: () => console.info('Switch to unlimited modal open'),
    },
  ]

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
        onClick: () => setDeleteAllModalOpen(true),
      },
    ]
  }

  return (
    <>
      <PopupMenu items={menuItems} className="w-50" />
      <DeleteAllPayoutsModal
        open={deleteAllModalOpen}
        onClose={() => setDeleteAllModalOpen(false)}
      />
    </>
  )
}
