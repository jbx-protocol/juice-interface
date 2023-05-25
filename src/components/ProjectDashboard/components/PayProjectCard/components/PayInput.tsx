import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { EthereumIcon } from 'components/icons/Ethereum'
import { twMerge } from 'tailwind-merge'

export const PayInput = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg border border-grey-300 bg-white p-2 pl-3',
        className,
      )}
    >
      <EthereumIcon />
      {/* // TODO: Remove placeholder with formik */}
      <input placeholder="0" className="flex-1 bg-transparent outline-none" />
      <div className="flex items-center gap-0.5 rounded-lg bg-bluebs-50 py-1.5 pl-2 pr-3 text-xs font-medium text-bluebs-600">
        <ChevronDownIcon className="h-5 w-5" />
        ETH
      </div>
    </div>
  )
}
