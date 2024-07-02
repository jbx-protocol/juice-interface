import { TrashIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { useCallback } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { twMerge } from 'tailwind-merge'
import { emitConfirmationDeletionModal } from '../../../utils/modals'
import { nftHoverButtonClasses } from './AddNftButton'

// Button that appears when hovering an NFT reward card
export function RemoveNftButton({ onClick }: { onClick: VoidFunction }) {
  const handleDeselect = useCallback(() => {
    emitConfirmationDeletionModal({
      onConfirm: onClick,
      title: t`Remove NFT`,
      description: t`Are you sure you want to remove this NFT?`,
    })
  }, [onClick])

  return (
    <div
      className={twMerge(
        'bg-error-500 hover:bg-error-600',
        nftHoverButtonClasses,
      )}
      onClick={stopPropagation(handleDeselect)}
    >
      <TrashIcon className="mr-1 h-6 w-6" />
      <span>
        <Trans>Remove NFT</Trans>
      </span>
    </div>
  )
}
