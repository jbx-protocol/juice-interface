import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySymbol from 'components/CurrencySymbol'

import { BigNumber } from '@ethersproject/bignumber'
import { ThemeContext } from 'contexts/themeContext'
import { Property } from 'csstype'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useContext, useMemo } from 'react'
import { formatWad } from 'utils/format/formatNumber'

import { CurrencyName } from 'constants/currency'
import { textPrimary, textSecondary } from 'constants/styles/text'
import StatLine from '../StatLine'

export const VolumeStatLine = ({
  totalVolume,
  color,
  convertToCurrency,
}: {
  totalVolume: BigNumber | undefined
  color: Property.Color
  convertToCurrency?: CurrencyName
}) => {
  const { theme } = useContext(ThemeContext)
  const secondaryTextStyle = textSecondary(theme)

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
      statLabel={<Trans>Volume</Trans>}
      statLabelTip={
        <Trans>
          The total funds this Juicebox project has received since it was
          created.
        </Trans>
      }
      statValue={
        <span style={textPrimary}>
          {convertedVolume && convertToCurrency ? (
            <span style={secondaryTextStyle}>
              <CurrencySymbol currency={convertToCurrency} />
              {convertedVolume}{' '}
            </span>
          ) : null}
          <span
            style={{
              color,
            }}
          >
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
