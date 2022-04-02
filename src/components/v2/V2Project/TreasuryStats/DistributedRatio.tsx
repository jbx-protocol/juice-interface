import { Trans } from '@lingui/macro'
import StatLine from 'components/shared/Project/StatLine'
import TooltipLabel from 'components/shared/TooltipLabel'

import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { CSSProperties, useContext } from 'react'

import V2CurrencyAmount from 'components/v2/shared/V2CurrencyAmount'

import { textSecondary } from 'constants/styles/text'

export default function DistributedRatio({ style }: { style?: CSSProperties }) {
  const { theme } = useContext(ThemeContext)
  const { colors } = theme
  const {
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
  } = useContext(V2ProjectContext)

  const secondaryTextStyle = textSecondary(theme)

  return (
    <StatLine
      style={style}
      loading={!Boolean(distributionLimit)}
      statLabel={<Trans>Distributed</Trans>}
      statLabelTip={
        <Trans>
          The amount that has been distributed from the Juicebox balance in this
          funding cycle, out of the current funding target. No more than the
          funding target can be distributed in a single funding cycle—any
          remaining ETH in Juicebox is overflow, until the next cycle begins.
        </Trans>
      }
      statValue={
        distributionLimit?.gt(0) ? (
          <div
            style={{
              ...secondaryTextStyle,
              color: colors.text.primary,
            }}
          >
            <V2CurrencyAmount
              amount={usedDistributionLimit}
              currency={distributionLimitCurrency}
            />{' '}
            /{' '}
            <V2CurrencyAmount
              amount={distributionLimit}
              currency={distributionLimitCurrency}
            />
          </div>
        ) : (
          <div
            style={{
              ...secondaryTextStyle,
              textAlign: 'right',
            }}
          >
            <TooltipLabel
              tip={
                <Trans>
                  The target for this funding cycle is 0, meaning all funds in
                  Juicebox are currently considered overflow. Overflow can be
                  redeemed by token holders, but not distributed.
                </Trans>
              }
              label={<Trans>100% overflow</Trans>}
            />
          </div>
        )
      }
    />
  )
}
