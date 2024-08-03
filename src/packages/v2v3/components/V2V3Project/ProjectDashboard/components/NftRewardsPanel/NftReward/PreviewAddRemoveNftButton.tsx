import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { emitConfirmationDeletionModal } from '../../../utils/modals'

const iconClasses = 'mr-1 h-6 w-6'
const containerClasses = 'flex items-center justify-center'

export function PreviewAddRemoveNftButton({
  className,
  isSelected,
  onSelect,
  onDeselect,
}: {
  className?: string
  isSelected?: boolean
  onSelect: VoidFunction
  onDeselect: VoidFunction
}) {
  const buttonContents = isSelected ? (
    <div className={containerClasses}>
      <MinusIcon className={iconClasses} />
      <span>
        <Trans>Remove NFT</Trans>
      </span>
    </div>
  ) : (
    <div className={containerClasses}>
      <PlusIcon className={iconClasses} />
      <span>
        <Trans>Add NFT</Trans>
      </span>
    </div>
  )

  const handleDeselect = useCallback(() => {
    emitConfirmationDeletionModal({
      onConfirm: onDeselect,
      title: t`Remove NFT`,
      description: t`Are you sure you want to remove this NFT?`,
    })
  }, [onDeselect])

  return (
    <Button
      type="primary"
      onClick={isSelected ? handleDeselect : onSelect}
      className={twMerge(
        isSelected ? 'border-none bg-error-500 hover:bg-error-600' : '',
        className,
      )}
    >
      {buttonContents}
    </Button>
  )
}
