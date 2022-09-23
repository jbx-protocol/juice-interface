import { Trans } from '@lingui/macro'
import StatLine from 'components/Project/StatLine'
import TooltipLabel from 'components/TooltipLabel'

import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { CSSProperties, useContext } from 'react'

import V2V3CurrencyAmount from 'components/v2v3/shared/V2V3CurrencyAmount'

import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

import { textSecondary } from 'constants/styles/text'

export default function DistributedRatio({ style }: { style?: CSSProperties }) {
  const { theme } = useContext(ThemeContext)
  const { colors } = theme
  const {
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
    loading: { distributionLimitLoading },
  } = useContext(V2V3ProjectContext)

  const secondaryTextStyle = textSecondary(theme)

  return (
    <StatLine
      style={style}
      loading={distributionLimitLoading}
      statLabel={<Trans>Distributed</Trans>}
      statLabelTip={
        <Trans>
          The amount distributed from the Juicebox balance in this funding
          cycle, out of the current distribution limit. No more than the
          distribution limit can be distributed in a single funding cycle. Any
          remaining ETH in Juicebox is overflow until the next cycle begins.
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
            <V2V3CurrencyAmount
              amount={usedDistributionLimit}
              currency={distributionLimitCurrency}
            />{' '}
            <>
              /{' '}
              {distributionLimit.eq(MAX_DISTRIBUTION_LIMIT) ? (
                <Trans>NO LIMIT</Trans>
              ) : (
                <V2V3CurrencyAmount
                  amount={distributionLimit}
                  currency={distributionLimitCurrency}
                />
              )}
            </>
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
                  The distribution limit for this funding cycle is 0, meaning
                  all funds in Juicebox are currently considered overflow.
                  Overflow can be redeemed by token holders, but not
                  distributed.
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
