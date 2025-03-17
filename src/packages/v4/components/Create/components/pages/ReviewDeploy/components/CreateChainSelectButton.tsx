import { CheckIcon } from '@heroicons/react/24/outline'
import { JB_CHAINS, JBChainId } from 'juice-sdk-core'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const CreateChainSelectButton: React.FC<{
  chainId: JBChainId
  value?: boolean
  onChange?: (value: boolean) => void
}> = ({ chainId, value: _value, onChange: _onChange }) => {
  const [checked, setChecked] = useState(_value ?? false)
  const value = _value ?? checked
  const onChange = _onChange ?? setChecked

  const chain = JB_CHAINS[chainId]
  return (
    <button
      className={twMerge(
        'flex items-center gap-5 rounded-lg border p-3 text-base font-medium text-black dark:text-grey-200',
        value
          ? 'border-bluebs-500 bg-bluebs-25 dark:border-bluebs-700 dark:bg-bluebs-900'
          : 'border-grey-200 dark:border-grey-800',
      )}
      onClick={() => onChange(!value)}
    >
      <div className="flex items-center gap-2">
        <span className="h-6 w-6">
          <ChainLogo chainId={chainId as JBChainId} />
        </span>
        <span>{chain.name}</span>
      </div>
      {value ? (
        <div className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-bluebs-500 bg-bluebs-500 dark:border-bluebs-600 dark:bg-bluebs-600">
          <CheckIcon className="h-3 w-3 text-white" />
        </div>
      ) : (
        <div className="h-4 w-4 rounded-[4px] border border-grey-300 dark:border-grey-800"></div>
      )}
    </button>
  )
}
