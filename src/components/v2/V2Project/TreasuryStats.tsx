import { Trans } from '@lingui/macro'
import ETHAmount from 'components/shared/currency/ETHAmount'
import StatLine from 'components/shared/Project/StatLine'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { CSSProperties, useContext } from 'react'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import USDAmount from 'components/shared/currency/USDAmount'
import TooltipLabel from 'components/shared/TooltipLabel'

export default function TreasuryStats() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
  } = useContext(V2ProjectContext)

  const spacing = 10

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.1rem',
    lineHeight: 1,
  }
  const secondaryTextStyle: CSSProperties = {
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontWeight: 500,
  }

  const formatCurrencyAmount = (amt: BigNumber | undefined) => {
    if (!amt) return null

    if (distributionLimitCurrency?.eq(V2_CURRENCY_ETH)) {
      return <ETHAmount amount={amt} precision={2} padEnd />
    }

    if (distributionLimitCurrency?.eq(V2_CURRENCY_USD)) {
      return <USDAmount amount={amt} precision={2} padEnd />
    }

    return null
  }

  return (
    <>
      <StatLine
        statLabel={<Trans>In Juicebox</Trans>}
        statLabelTip={
          <Trans>The balance of this project in the Juicebox contract.</Trans>
        }
        statValue={
          <div
            style={{
              ...primaryTextStyle,
              color: colors.text.brand.primary,
              marginLeft: 10,
            }}
          >
            {distributionLimitCurrency?.eq(V2_CURRENCY_USD) ? (
              <span style={secondaryTextStyle}>
                <ETHAmount amount={ETHBalance} precision={4} padEnd={true} />{' '}
              </span>
            ) : (
              ''
            )}
            {formatCurrencyAmount(
              balanceInDistributionLimitCurrency ?? BigNumber.from(0),
            )}
          </div>
        }
        style={{ marginBottom: spacing }}
        loading={!Boolean(balanceInDistributionLimitCurrency)}
      />

      <StatLine
        loading={!Boolean(distributionLimit)}
        statLabel={<Trans>Distributed</Trans>}
        statLabelTip={
          <Trans>
            The amount that has been distributed from the Juicebox balance in
            this funding cycle, out of the current funding target. No more than
            the funding target can be distributed in a single funding cycle—any
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
              {formatCurrencyAmount(usedDistributionLimit)} /{' '}
              {formatCurrencyAmount(distributionLimit)}
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
    </>
  )
}
