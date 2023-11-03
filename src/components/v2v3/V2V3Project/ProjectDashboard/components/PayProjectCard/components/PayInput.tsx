import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { FocusEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { V2V3CurrencyName, V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { CurrencyIcon } from '../../ui/CurrencyIcon'
import { usePayInput } from '../hooks/usePayInput'

export type PayInputValue = {
  amount: string
  currency: V2V3CurrencyOption
}

type Props = {
  className?: string
  placeholder?: string
  value?: PayInputValue
  onChange?: (value: PayInputValue) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  name?: string
}

export const PayInput = ({
  className,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
}: Props) => {
  const {
    value: { amount, currency },
    onInputChange,
    onCurrencyChange,
  } = usePayInput(value, onChange)

  return (
    <div
      className={twMerge(
        'dark:slate-900 flex items-center gap-2 rounded-lg border border-grey-300 bg-white p-2 pl-3 dark:border-slate-500 dark:bg-slate-950',
        className,
      )}
    >
      <CurrencyIcon className="flex-0 h-7 w-7" currency={currency} />
      <input
        data-testid="pay-input-input"
        className="min-w-0 flex-1 bg-transparent text-base outline-none"
        placeholder={placeholder}
        value={amount}
        onChange={onInputChange}
        onBlur={onBlur}
        name={name}
      />
      <div
        role="button"
        data-testid="pay-input-currency-button"
        className={twMerge(
          'flex select-none items-center gap-0.5 rounded py-1.5 pl-2 pr-3 text-xs font-medium transition-colors',
          currency === V2V3_CURRENCY_ETH
            ? 'bg-bluebs-50 text-bluebs-600 dark:bg-bluebs-500 dark:text-bluebs-950'
            : 'bg-melon-50 text-melon-600 dark:bg-melon-500 dark:text-melon-950',
        )}
        onClick={onCurrencyChange}
      >
        <ChevronDownIcon className="h-5 w-5" />
        {V2V3CurrencyName(currency)}
      </div>
    </div>
  )
}
