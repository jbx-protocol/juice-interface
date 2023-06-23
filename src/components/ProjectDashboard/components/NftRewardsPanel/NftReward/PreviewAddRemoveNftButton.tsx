import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'

const iconClasses = 'mr-1 h-6 w-6'
const containerClasses = 'flex items-center justify-center'

export function PreviewAddRemoveNftButton({
  onSelect,
  onDeselect,
  isSelected,
}: {
  onSelect: VoidFunction
  onDeselect: VoidFunction
  isSelected?: boolean
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
      className={
        isSelected ? 'border-none bg-error-500 hover:bg-error-600' : ''
      }
    >
      {buttonContents}
    </Button>
  )
}
