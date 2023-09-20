import { PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { stopPropagation } from 'react-stop-propagation'
import { twMerge } from 'tailwind-merge'

export const nftHoverButtonClasses =
  'absolute bottom-0 flex h-12 w-full items-center justify-center rounded-b-lg text-base font-medium text-white opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100'

// Button that appears when hovering an NFT reward card
export function AddNftButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <div
      className={twMerge(
        'bg-bluebs-500 hover:bg-bluebs-600',
        nftHoverButtonClasses,
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
