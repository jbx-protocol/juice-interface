import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Budget } from '../models/budget'
import { Transactor } from '../models/transactor'
import BudgetDetail from './BudgetDetail'
import { padding } from '../constants/styles/padding'

export default function BudgetsHistory({
  contracts,
  transactor,
  providerAddress,
}: {
  contracts?: Contracts
  transactor?: Transactor
  providerAddress?: string
}) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [poolNumbers, setPoolNumbers] = useState<BigNumber[]>([])

  const { number }: { number?: string } = useParams()

  if (number !== undefined && !poolNumbers.length)
    setPoolNumbers([BigNumber.from(number)])

  const allPoolsLoaded = budgets.length >= poolNumbers.length
  const poolNumber = allPoolsLoaded
    ? undefined
    : poolNumbers[poolNumbers.length - 1]
  const pollTime = allPoolsLoaded ? undefined : 100

  useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getBudge',
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

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 40,
        padding: padding.app,
      }}
    >
      {budgets.map((budget, index) => (
        <div key={index}>
          <BudgetDetail
            providerAddress={providerAddress}
            budget={budget}
            showSustained={true}
            transactor={transactor}
            contracts={contracts}
          />
        </div>
      ))}

      {allPoolsLoaded ? null : <div>Loading...</div>}
    </div>
  )
}
