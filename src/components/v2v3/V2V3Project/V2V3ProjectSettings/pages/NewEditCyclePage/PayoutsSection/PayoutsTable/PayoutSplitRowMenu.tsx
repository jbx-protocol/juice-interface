import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { PopupMenu } from 'components/ui/PopupMenu'

export function PayoutSplitRowMenu({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: VoidFunction
  onDeleteClick: VoidFunction
}) {
  const menuItemsLabelClass = 'flex gap-2 items-center'
  const menuItemsIconClass = 'h-5 w-5'

  const menuItems = [
    {
      id: 'edit',
      label: (
        <div className={menuItemsLabelClass}>
          <PencilIcon className={menuItemsIconClass} />
          <Trans>Edit</Trans>
        </div>
      ),
      onClick: onEditClick,
    },
    {
      id: 'delete',
      label: (
        <div className={menuItemsLabelClass}>
          <TrashIcon className={menuItemsIconClass} />
          <Trans>Delete</Trans>
        </div>
      ),
      onClick: onDeleteClick,
    },
  ]

  return <PopupMenu items={menuItems} />
}
