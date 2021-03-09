import { BigNumber } from '@ethersproject/bignumber'
import { Progress } from 'antd'
import { UserContext } from 'contexts/userContext'
import { Budget } from 'models/budget'
import React, { useContext, useMemo } from 'react'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import {
  CurrencyUtils,
  formatWad,
  fracDiv,
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
  const { usdPerEth } = useContext(UserContext)

  const currencyUtils = new CurrencyUtils(usdPerEth)
  const currency = formatBudgetCurrency(budget?.currency)

  const weiSurplus = useMemo(() => {
    if (!budget) return

    const weiTarget =
      currency === 'USD'
        ? currencyUtils.usdToWei(formatWad(budget.target))
        : budget.target

    if (!weiTarget) return

    return budget.total.gt(weiTarget)
      ? budget.total.sub(weiTarget)
      : BigNumber.from(0)
  }, [budget?.target, budget?.total, usdPerEth, currency])

  const formattedSurplus = useMemo(
    () =>
      weiSurplus
        ? currency === 'USD'
          ? currencyUtils.weiToUsd(weiSurplus)?.toString()
          : formatWad(weiSurplus)
        : undefined,
    [weiSurplus, currency],
  )

  const percentPaid = useMemo(() => {
    if (!budget) return

    const total =
      currency === 'USD'
        ? parseWad(currencyUtils.weiToUsd(budget.total)?.toString())
        : budget.total

    if (!total) return

    return fracDiv(total.toString(), budget.target.toString()) * 100
  }, [budget?.target, budget?.total, currency])

  const formattedPaid = useMemo(() => {
    if (!budget) return

    const wadAmount =
      currency === 'USD'
        ? currencyUtils.weiToUsd(budget.total)?.toString()
        : formatWad(budget.total)

    return wadAmount ?? '0'
  }, [currency, budget?.total])

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
