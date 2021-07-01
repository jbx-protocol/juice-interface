import { BigNumber } from '@ethersproject/bignumber'
import { Progress } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import React, { CSSProperties, useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formattedNum, formatWad, fracDiv, fromWad } from 'utils/formatNumber'

import { smallHeaderStyle } from './styles'
import { CurrencyOption } from 'models/currency-option'

export default function Paid({
  projectId,
  fundingCycle,
  balanceInCurrency,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  balanceInCurrency: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const converter = useCurrencyConverter()

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const overflowInCurrency = useMemo(
    () =>
      totalOverflow &&
      converter.wadToCurrency(
        totalOverflow,
        fundingCycle?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [fundingCycle?.currency, totalOverflow, converter],
  )

  const paidInCurrency = balanceInCurrency?.add(fundingCycle?.tapped ?? 0)

  const percentPaid = useMemo(
    () =>
      paidInCurrency && fundingCycle?.target
        ? fracDiv(paidInCurrency.toString(), fundingCycle.target.toString()) *
          100
        : 0,
    [fundingCycle?.target, paidInCurrency],
  )

  const percentOverflow = fracDiv(
    overflowInCurrency?.toString() ?? '0',
    paidInCurrency?.toString() ?? '1',
  )

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.2rem',
  }

  const subTextStyle: CSSProperties = {
    color: colors.text.tertiary,
    fontSize: '0.8rem',
  }

  if (!fundingCycle) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={smallHeaderStyle(colors)}>
            <TooltipLabel
              label="PAID"
              tip="The total paid to the project in this funding cycle, plus any unclaimed overflow from the previous funding cycle."
            />
          </div>
          <div
            style={{
              ...primaryTextStyle,
              color: colors.text.brand.primary,
            }}
          >
            <CurrencySymbol
              currency={fundingCycle.currency.toNumber() as CurrencyOption}
            />
            {fundingCycle.currency.eq(1) ? (
              <span>
                {formatWad(paidInCurrency)}{' '}
                <span style={subTextStyle}>
                  <CurrencySymbol currency={0} />
                  {formatWad(converter.usdToWei(fromWad(paidInCurrency)))}
                </span>
              </span>
            ) : (
              formatWad(paidInCurrency)
            )}
          </div>
        </div>

        {totalOverflow?.gt(0) && (
          <div style={{ fontWeight: 500, textAlign: 'right' }}>
            <div style={smallHeaderStyle(colors)}>
              <TooltipLabel
                label="OVERFLOW"
                tip="The amount paid to the project, minus the current funding cycle's target. Overflow can be claimed by project token holders. Any unclaimed overflow from this cycle will go towards the next cycle's target."
              />
            </div>
            {fundingCycle.currency.eq(1) ? (
              <span>
                <span style={subTextStyle}>
                  <CurrencySymbol currency={0} />
                  {formatWad(totalOverflow ?? 0)}
                </span>{' '}
                <span style={primaryTextStyle}>
                  <CurrencySymbol currency={1} />
                  {formattedNum(converter.weiToUsd(totalOverflow))}
                </span>
              </span>
            ) : (
              <span>
                <CurrencySymbol currency={0} />
                {formatWad(totalOverflow ?? 0)}
              </span>
            )}
          </div>
        )}
      </div>

      {totalOverflow?.gt(0) ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress
            style={{
              width: (1 - percentOverflow) * 100 + '%',
              minWidth: 10,
            }}
            percent={percentPaid}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
          <div
            style={{
              width: 4,
              height: 15,
              borderRadius: 2,
              background: colors.text.primary,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 3,
            }}
          ></div>
          <Progress
            style={{
              width: percentOverflow * 100 + '%',
              minWidth: 10,
            }}
            percent={100}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
        </div>
      ) : (
        <Progress
          percent={percentPaid}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />
      )}

      <div style={{ marginTop: 4 }}>
        <span style={{ ...primaryTextStyle, color: colors.text.secondary }}>
          <CurrencySymbol
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
          />
          {formatWad(fundingCycle.target)}{' '}
        </span>
        <div style={smallHeaderStyle(colors)}>
          <TooltipLabel
            label="TARGET"
            tip="The maximum amount this project can withdraw during this funding cycle."
          />
        </div>
      </div>
    </div>
  )
}
