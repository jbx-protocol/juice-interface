import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { EthereumIcon } from 'components/icons/Ethereum'

export const PayInput = () => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-grey-300 bg-white p-2 pl-3">
      <EthereumIcon />
      {/* // TODO: Remove placeholder with formik */}
      <input placeholder="0" className="flex-1 bg-transparent" />
      <div className="flex items-center gap-0.5 rounded-lg bg-bluebs-50 py-1.5 pl-2 pr-3 text-xs font-medium text-bluebs-600">
        <ChevronDownIcon className="h-5 w-5" />
        ETH
      </div>
    </div>
  )
}
