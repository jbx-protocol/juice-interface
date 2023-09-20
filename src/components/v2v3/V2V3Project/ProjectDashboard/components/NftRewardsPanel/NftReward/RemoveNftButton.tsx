import { TrashIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { stopPropagation } from 'react-stop-propagation'
import { twMerge } from 'tailwind-merge'
import { nftHoverButtonClasses } from './AddNftButton'

// Button that appears when hovering an NFT reward card
export function RemoveNftButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <div
      className={twMerge(
        'bg-error-500 hover:bg-error-600',
        nftHoverButtonClasses,
      )}
      onClick={stopPropagation(onClick)}
    >
      <TrashIcon className="mr-1 h-6 w-6" />
      <span>
        <Trans>Remove NFT</Trans>
      </span>
    </div>
  )
}
