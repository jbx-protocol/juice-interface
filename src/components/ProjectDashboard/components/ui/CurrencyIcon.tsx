import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { EthereumIcon } from 'components/icons/Ethereum'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { twMerge } from 'tailwind-merge'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'

export const CurrencyIcon = ({
  className,
  innerIconClassName,
  currency,
}: {
  className?: string
  innerIconClassName?: string
  currency: V2V3CurrencyOption
}) => (
  <div
    data-testid="pay-input-currency-icon"
    className={twMerge(
      'flex h-7 w-7 items-center justify-center rounded-full bg-bluebs-50 p-1 transition-colors',
      currency === V2V3_CURRENCY_ETH
        ? 'bg-bluebs-50 text-bluebs-500 dark:bg-bluebs-500 dark:text-bluebs-950'
        : 'bg-melon-50 text-melon-600 dark:bg-melon-500 dark:text-melon-950',
      className,
    )}
  >
    {currency === V2V3_CURRENCY_ETH ? (
      <EthereumIcon className={twMerge('h-full w-full', innerIconClassName)} />
    ) : (
      <CurrencyDollarIcon
        className={twMerge('h-full w-full', innerIconClassName)}
      />
    )}
  </div>
)
