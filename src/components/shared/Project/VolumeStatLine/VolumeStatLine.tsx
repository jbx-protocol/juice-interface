import { Trans } from '@lingui/macro'
import ETHAmount from 'components/shared/currency/ETHAmount'
import CurrencySymbol from 'components/shared/CurrencySymbol'

import { ThemeContext } from 'contexts/themeContext'
import { Property } from 'csstype'
import { BigNumber } from 'ethers/lib/ethers'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { useContext, useMemo } from 'react'
import { formatWad } from 'utils/formatNumber'

import { textPrimary, textSecondary } from 'constants/styles/text'
import { CurrencyName } from 'constants/currency'
import StatLine from '../StatLine'

export const VolumeStatLine = ({
  totalVolume,
  color,
  convertTo,
}: {
  totalVolume: BigNumber | undefined
  color: Property.Color
  convertTo?: { currency: CurrencyName }
}) => {
  const { theme } = useContext(ThemeContext)
  const secondaryTextStyle = textSecondary(theme)

  // TODO-wraeth: This is a v1 hook - do we need to update?
  const converter = useCurrencyConverter()

  const convertedVolume = useMemo(() => {
    if (!convertTo) return undefined
    const { currency: targetCurrency } = convertTo
    return formatWad(
      converter.wadToCurrency(totalVolume, targetCurrency, 'ETH'),
      { precision: 2, padEnd: true },
    )
  }, [convertTo, converter, totalVolume])

  return (
    <StatLine
      statLabel={<Trans>Volume</Trans>}
      statLabelTip={
        <Trans>
          The total amount received by this project through Juicebox since it
          was created.
        </Trans>
      }
      statValue={
        <span style={textPrimary}>
          {convertedVolume && convertTo ? (
            <span style={secondaryTextStyle}>
              <CurrencySymbol currency={convertTo.currency} />
              {convertedVolume}{' '}
            </span>
          ) : null}
          <span
            style={{
              color,
            }}
          >
            <ETHAmount amount={totalVolume} precision={4} />
          </span>
        </span>
      }
    />
  )
}
