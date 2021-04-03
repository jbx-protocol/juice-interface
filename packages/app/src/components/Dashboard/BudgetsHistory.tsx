import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { useCallback, useState } from 'react'
import { budgetCurrencySymbol } from 'utils/budgetCurrency'
import { budgetsDiff } from 'utils/budgetsDiff'

import { CardSection } from '../shared/CardSection'

export default function BudgetsHistory({
  startId,
}: {
  startId: BigNumber | undefined
}) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [poolNumbers, setPoolNumbers] = useState<BigNumber[]>([])

  if (startId?.gt(0) && !poolNumbers.length) setPoolNumbers([startId])

  const allPoolsLoaded = budgets.length >= poolNumbers.length
  const poolNumber = allPoolsLoaded
    ? undefined
    : poolNumbers[poolNumbers.length - 1]

  useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getBudget',
    args: poolNumber ? [poolNumber] : null,
    valueDidChange: budgetsDiff,
    callback: useCallback(
      budget => {
        if (
          !budget ||
          !poolNumber ||
          poolNumbers.includes(budget.previous) ||
          budget.id.eq(0)
        )
          return

        setBudgets([...budgets, budget])
        setPoolNumbers([
          ...poolNumbers,
          ...(budget.previous.toNumber() > 0 ? [budget.previous] : []),
        ])
      },
      [poolNumber, poolNumbers, budgets],
    ),
  })

  const budgetElems = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {budgets.length ? (
        budgets.map(budget => (
          <div key={budget.id.toString()}>
            <div>#{budget.id.toString()}</div>
            <div>
              Tapped: {budgetCurrencySymbol(budget.currency)}
              {budget.tappedTarget}
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: 25 }}>No budget history</div>
      )}
    </Space>
  )

  return (
    <CardSection>
      {budgetElems}

      {allPoolsLoaded ? null : <div style={{ padding: 25 }}>Loading...</div>}
    </CardSection>
  )
}
