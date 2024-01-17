import { Trans } from '@lingui/macro'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import ETHAmount from 'components/currency/ETHAmount'
import { CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useMemo } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import StatLine from '../StatLine'

export const VolumeStatLine = ({
  totalVolume,
  convertToCurrency,
}: {
  totalVolume: BigNumber | undefined
  convertToCurrency?: CurrencyName
}) => {
  const converter = useCurrencyConverter()

  const convertedVolume = useMemo(() => {
    if (!convertToCurrency) return undefined
    return formatWad(
      converter.wadToCurrency(totalVolume, convertToCurrency, 'ETH'),
      { precision: 2, padEnd: true },
    )
  }, [convertToCurrency, converter, totalVolume])

  return (
    <StatLine
      statLabel={<Trans>Total raised</Trans>}
      statLabelTip={
        <Trans>
          The amount of ETH this project has received since it was created.
        </Trans>
      }
      statValue={
        <span className="text-lg font-medium">
          {convertedVolume && convertToCurrency ? (
            <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-600">
              <CurrencySymbol currency={convertToCurrency} />
              {convertedVolume}{' '}
            </span>
          ) : null}
          <span className="text-black dark:text-slate-100">
            <ETHAmount
              amount={totalVolume ?? BigNumber.from(0)}
              precision={2}
            />
          </span>
        </span>
      }
    />
  )
}
