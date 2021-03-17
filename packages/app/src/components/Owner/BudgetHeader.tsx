import { BigNumber } from '@ethersproject/bignumber'
import { Progress } from 'antd'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import React, { useMemo } from 'react'
import { budgetCurrencyName } from 'utils/budgetCurrency'
import {
  formattedNum,
  formatWad,
  fracDiv,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'

import { colors } from '../../constants/styles/colors'

export default function BudgetHeader({
  budget,
  gutter,
}: {
  budget?: Budget
  gutter: number
}) {
  const converter = useCurrencyConverter()
  const currency = budgetCurrencyName(budget?.currency)

  const weiSurplus = useMemo(() => {
    if (!budget?.total || !budget?.target) return

    const weiTarget =
      currency === 'USD'
        ? converter.usdToWei(fromWad(budget.target))
        : budget.target

    if (!weiTarget) return

    return budget.total.gt(weiTarget)
      ? budget.total.sub(weiTarget)
      : BigNumber.from(0)
  }, [budget?.target, budget?.total, currency, converter])

  const formattedSurplus = useMemo(
    () =>
      weiSurplus
        ? currency === 'USD'
          ? formattedNum(converter.weiToUsd(weiSurplus))
          : formatWad(weiSurplus)
        : undefined,
    [weiSurplus, currency, converter],
  )

  const percentPaid = useMemo(() => {
    if (!budget?.total || !budget?.target) return

    const total =
      currency === 'USD'
        ? parseWad(converter.weiToUsd(budget.total)?.toString())
        : budget.total

    if (!total) return

    return fracDiv(total.toString(), budget.target.toString()) * 100
  }, [budget?.target, budget?.total, currency, converter])

  const formattedPaid = useMemo(() => {
    if (!budget?.total) return

    const wadAmount =
      currency === 'USD'
        ? converter.weiToUsd(budget.total)?.toString()
        : fromWad(budget.total)

    return wadAmount ?? '0'
  }, [currency, budget?.total, converter])

  if (!budget) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingTop: 15,
        marginBottom: 0,
        paddingBottom: 15,
        paddingLeft: gutter,
        paddingRight: gutter,
        whiteSpace: 'pre',
      }}
    >
      <h3
        style={{
          fontWeight: 600,
          marginRight: gutter,
          marginBottom: 0,
        }}
      >
        # {budget.number.toString()}
      </h3>
      <Progress
        percent={percentPaid}
        showInfo={false}
        strokeColor={colors.juiceOrange}
      ></Progress>
      <span style={{ marginLeft: gutter }}>
        <span style={{ fontWeight: 600 }}>{formattedPaid}</span>/
        {formatWad(budget.target)}{' '}
        {weiSurplus?.gt(0) ? (
          <span
            style={{
              color: colors.secondary,
              fontWeight: 600,
            }}
          >
            +{formattedSurplus}
          </span>
        ) : null}{' '}
        {currency}
      </span>
    </div>
  )
}
