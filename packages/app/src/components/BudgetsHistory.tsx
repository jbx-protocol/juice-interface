import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Divider, Space } from 'antd'
import React, { useState } from 'react'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import BudgetDetail from './BudgetDetail'

export default function BudgetsHistory({
  contracts,
  transactor,
  userAddress,
  startId,
  provider,
}: {
  contracts?: Contracts
  transactor?: Transactor
  userAddress?: string
  startId?: BigNumber
  provider?: JsonRpcProvider
}) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [poolNumbers, setPoolNumbers] = useState<BigNumber[]>([])

  if (startId !== undefined && !poolNumbers.length) setPoolNumbers([startId])

  const allPoolsLoaded = budgets.length >= poolNumbers.length
  const poolNumber = allPoolsLoaded
    ? undefined
    : poolNumbers[poolNumbers.length - 1]
  const pollTime = allPoolsLoaded ? undefined : 100

  useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getBudget',
    args: [poolNumber],
    pollTime,
    callback: budget => {
      if (!budget || !poolNumber || poolNumbers.includes(budget.previous))
        return
      setBudgets([...budgets, budget])
      setPoolNumbers([
        ...poolNumbers,
        ...(budget.previous.toNumber() > 0 ? [budget.previous] : []),
      ])
    },
  })

  const budgetElems = (
    <Space direction="vertical" split={<Divider />}>
      {budgets.length
        ? budgets.map((budget, index) => (
            <BudgetDetail
              key={index}
              userAddress={userAddress}
              budget={budget}
              showSustained={true}
              showMinted={true}
              transactor={transactor}
              contracts={contracts}
              provider={provider}
            />
          ))
        : 'No history'}
    </Space>
  )

  return (
    <div>
      {budgetElems}

      {allPoolsLoaded ? null : <div>Loading...</div>}
    </div>
  )
}
