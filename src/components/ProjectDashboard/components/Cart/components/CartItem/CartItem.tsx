import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

export type CartItemProps = {
  className?: string
  title: ReactNode
  price: { amount: number; currency: V2V3CurrencyOption } | null
  icon: ReactNode
  onRemove: () => void
} & (
  | {
      quantity: number
      onIncrease: () => void
      onDecrease: () => void
    }
  | object
)

export const CartItem: React.FC<CartItemProps> = ({
  className,
  title,
  price,
  icon,
  onRemove,
  ...quantityProps
}) => {
  const priceText = useMemo(() => {
    if (price === null) {
      return '-'
    }
    return formatCurrencyAmount(price)
  }, [price])

  return (
    <div
      className={twMerge(
        'flex items-center justify-between border-b border-grey-200 py-5 dark:border-slate-500',
        className,
      )}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3 dark:text-slate-50">{title}</span>
      </div>
      <div className="flex items-center">
        {'quantity' in quantityProps && (
          <span className="mr-8 flex gap-3 rounded-lg border border-grey-200 p-1 text-sm">
            <button
              data-testid="cart-item-decrease-button"
              onClick={quantityProps.onDecrease}
            >
              <MinusIcon className="h-4 w-4 text-grey-500" />
            </button>
            {quantityProps.quantity}
            <button
              data-testid="cart-item-increase-button"
              onClick={quantityProps.onIncrease}
            >
              <PlusIcon className="h-4 w-4 text-grey-500" />
            </button>
          </span>
        )}
        <span className="mr-4 text-sm font-medium">{priceText}</span>
        <TrashIcon
          data-testid="cart-item-remove-button"
          role="button"
          className="inline h-4 w-4 text-grey-400 dark:text-slate-300"
          onClick={onRemove}
        />
      </div>
    </div>
  )
}
