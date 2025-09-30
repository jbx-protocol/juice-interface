import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { V4V5_CURRENCY_ETH, getV4V5CurrencyUSD } from 'packages/v4v5/utils/currency'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import {
  payoutsTableMenuItemsIconClass,
  payoutsTableMenuItemsLabelClass,
} from './PayoutTableSettings'

import { Trans } from '@lingui/macro'
import { PopupMenu } from 'components/ui/PopupMenu'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import round from 'lodash/round'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { usePayoutsTable } from './hooks/usePayoutsTable'

export function CurrencySwitcher() {
  const { version } = useV4V5Version()
  const { setCurrency: setCurrencyName, usdDisabled } = usePayoutsTableContext()
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
      {setCurrencyName && !usdDisabled ? <ChevronDownIcon className="h-4 w-4" /> : null}
    </div>
  )

  if (!setCurrencyName || usdDisabled) {
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
              setCurrency(getV4V5CurrencyUSD(version))
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
              setCurrency(V4V5_CURRENCY_ETH)
            },
          },
        ]

  return <PopupMenu customButton={button} items={items} />
}
