import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import useMobile from 'hooks/useMobile'
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
  const isMobile = useMobile()

  const priceText = useMemo(() => {
    if (price === null) {
      return '-'
    }
    return formatCurrencyAmount(price)
  }, [price])

  if (isMobile) {
    return (
      <div
        className={twMerge(
          'flex justify-between gap-3 border-b border-grey-200 py-6 dark:border-slate-500',
          className,
        )}
      >
        <div className="flex min-w-0 gap-3">
          {icon}
          <div className="flex min-w-0 flex-col gap-3">
            <span className="mt-3">{title}</span>
            {'quantity' in quantityProps && (
              <QuantityControl {...quantityProps} />
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <span className="mr-4 text-sm font-medium">{priceText}</span>
          <RemoveIcon onClick={onRemove} />
        </div>
      </div>
    )
  }

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
        {'quantity' in quantityProps && <QuantityControl {...quantityProps} />}
        <span className="mr-4 text-sm font-medium">{priceText}</span>
        <RemoveIcon onClick={onRemove} />
      </div>
    </div>
  )
}

const RemoveIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <TrashIcon
    data-testid="cart-item-remove-button"
    role="button"
    className="inline h-6 w-6 text-grey-400 dark:text-slate-300 md:h-4 md:w-4"
    onClick={onClick}
  />
)

const QuantityControl: React.FC<{
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <span className="mr-8 flex w-fit gap-3 rounded-lg border border-grey-200 p-1 text-sm">
      <button data-testid="cart-item-decrease-button" onClick={onDecrease}>
        <MinusIcon className="h-4 w-4 text-grey-500" />
      </button>
      {quantity}
      <button data-testid="cart-item-increase-button" onClick={onIncrease}>
        <PlusIcon className="h-4 w-4 text-grey-500" />
      </button>
    </span>
  )
}
