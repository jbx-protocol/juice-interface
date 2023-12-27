import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { PopupMenu } from 'components/ui/PopupMenu'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import round from 'lodash/round'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import {
  payoutsTableMenuItemsIconClass,
  payoutsTableMenuItemsLabelClass,
} from './PayoutTableSettings'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { usePayoutsTable } from './hooks/usePayoutsTable'

export function CurrencySwitcher() {
  const { setCurrency: setCurrencyName } = usePayoutsTableContext()
  const { currency, setCurrency, distributionLimit, setDistributionLimit } =
    usePayoutsTable()
  const converter = useCurrencyConverter()

  const button = (
    <div className="flex items-center gap-2">
      {currency === 'ETH' ? (
        <Trans>Amount (ETH)</Trans>
      ) : (
        <Trans>Amount (USD)</Trans>
      )}
      {setCurrencyName ? <ChevronDownIcon className="h-4 w-4" /> : null}
    </div>
  )

  if (!setCurrencyName) {
    return button
  }

  const itemsClassName = `${payoutsTableMenuItemsLabelClass} text-primary`
  const items =
    currency === 'ETH'
      ? [
          {
            id: 'switchToUsd',
            label: (
              <div className={itemsClassName}>
                <ArrowPathIcon className={payoutsTableMenuItemsIconClass} />
                <Trans>Convert to USD</Trans>
              </div>
            ),
            onClick: () => {
              const usdAmount = converter.wadToCurrency(
                parseWad(distributionLimit),
                'USD',
                'ETH',
              )
              const formattedUsdAmount = round(
                parseFloat(fromWad(usdAmount)),
                2,
              )
              setDistributionLimit(formattedUsdAmount)
              setCurrency(V2V3_CURRENCY_USD)
            },
          },
        ]
      : [
          {
            id: 'switchToEth',
            label: (
              <div className={itemsClassName}>
                <ArrowPathIcon className={payoutsTableMenuItemsIconClass} />
                <Trans>Convert to ETH</Trans>
              </div>
            ),
            onClick: () => {
              const ethAmount = converter.wadToCurrency(
                parseWad(distributionLimit),
                'ETH',
                'USD',
              )
              const formattedEthAmount = round(
                parseFloat(fromWad(ethAmount)),
                4,
              )
              setDistributionLimit(formattedEthAmount)
              setCurrency(V2V3_CURRENCY_ETH)
            },
          },
        ]

  return <PopupMenu customButton={button} items={items} />
}
