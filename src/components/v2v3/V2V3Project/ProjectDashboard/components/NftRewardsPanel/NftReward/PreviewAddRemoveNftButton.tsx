import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'

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
  return (
    <Button
      type="primary"
      onClick={isSelected ? onDeselect : onSelect}
      className={twMerge(
        isSelected ? 'border-none bg-error-500 hover:bg-error-600' : '',
        className,
      )}
    >
      {buttonContents}
    </Button>
  )
}
