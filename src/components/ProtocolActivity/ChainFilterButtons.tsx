import { CheckIcon } from '@heroicons/react/24/outline'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export const ChainFilterButton: React.FC<{
  chainId: number
  selected: boolean
  onChange: (selected: boolean) => void
}> = ({ chainId, selected, onChange }) => {
  const chain = NETWORKS[chainId]

  return (
    <button
      className={twMerge(
        'relative flex items-center justify-center rounded-lg border p-2 transition-colors',
        selected
          ? 'border-bluebs-500 bg-bluebs-25 dark:border-bluebs-700 dark:bg-bluebs-900'
          : 'border-grey-200 hover:border-grey-300 hover:bg-grey-50 dark:border-grey-800 dark:hover:bg-slate-800',
      )}
      onClick={() => onChange(!selected)}
      title={chain.label}
    >
      <span className="h-6 w-6">
        <ChainLogo chainId={chainId as JBChainId} />
      </span>
      {selected && (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-bluebs-500 bg-bluebs-500 dark:border-bluebs-600 dark:bg-bluebs-600">
          <CheckIcon className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  )
}
