import { PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'

// Button that appears when hovering an NFT reward card
export function AddNftButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <div
      className={classNames(
        'absolute bottom-0 h-12 w-full bg-bluebs-500 text-base font-medium text-white',
        'flex items-center justify-center opacity-0 group-hover:opacity-100',
        'rounded-b-lg transition-opacity duration-200 ease-in-out',
      )}
      onClick={stopPropagation(onClick)}
    >
      <PlusIcon className="mr-1 h-6 w-6" />
      <span>
        <Trans>Add NFT</Trans>
      </span>
    </div>
  )
}
