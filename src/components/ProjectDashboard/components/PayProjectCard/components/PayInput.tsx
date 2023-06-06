import {
  ChevronDownIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { EthereumIcon } from 'components/icons/Ethereum'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePayInput } from '../hooks/usePayInput'

export type PayInputValue = {
  amount: string
  currency: 'eth' | 'usd'
}

type Props = {
  className?: string
  placeholder?: string
  value?: PayInputValue
  onChange?: (value: PayInputValue) => void
}

export const PayInput = ({
  className,
  placeholder,
  value,
  onChange,
}: Props) => {
  const {
    value: { amount, currency },
    onInputChange,
    onCurrencyChange,
  } = usePayInput(value, onChange)

  const CurrencyIcon = useMemo(() => {
    return (
      <div
        data-testid="pay-input-currency-icon"
        className={twMerge(
          'rounded-full bg-bluebs-50 p-1 transition-colors',
          currency === 'eth'
            ? 'bg-bluebs-50 text-bluebs-500 dark:bg-bluebs-500 dark:text-bluebs-950'
            : 'bg-melon-50 text-melon-600 dark:bg-melon-500 dark:text-melon-950',
        )}
      >
        {currency === 'eth' ? (
          <EthereumIcon className="h-5 w-5" />
        ) : (
          <CurrencyDollarIcon className="h-5 w-5" />
        )}
      </div>
    )
  }, [currency])

  return (
    <div
      className={twMerge(
        'dark:slate-900 flex items-center gap-2 rounded-lg border border-grey-300 bg-white p-2 pl-3 dark:border-slate-500 dark:bg-slate-950',
        className,
      )}
    >
      {CurrencyIcon}
      <input
        data-testid="pay-input-input"
        className="flex-1 bg-transparent outline-none"
        placeholder={placeholder}
        value={amount}
        onChange={onInputChange}
      />
      <div
        role="button"
        data-testid="pay-input-currency-button"
        className={twMerge(
          'flex select-none items-center gap-0.5 rounded-lg py-1.5 pl-2 pr-3 text-xs font-medium transition-colors',
          currency === 'eth'
            ? 'bg-bluebs-50 text-bluebs-600 dark:bg-bluebs-500 dark:text-bluebs-950'
            : 'bg-melon-50 text-melon-600 dark:bg-melon-500 dark:text-melon-950',
        )}
        onClick={onCurrencyChange}
      >
        <ChevronDownIcon className="h-5 w-5" />
        {currency.toUpperCase()}
      </div>
    </div>
  )
}
