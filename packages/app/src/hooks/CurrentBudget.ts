import { ContractName } from 'constants/contract-name'
import { Budget } from 'models/budget'
import { useCallback, useMemo, useState } from 'react'
import { budgetsDiff } from 'utils/budgetsDiff'

import useContractReader from './ContractReader'

export function useCurrentBudget(userAddress?: string) {
  const [currentBudgetId, setCurrentBudgetId] = useState<string>()

  const updateOn = useMemo(
    () => [
      ...(userAddress
        ? [
            {
              contract: ContractName.BudgetStore,
              eventName: 'Configure',
              topics: [[], userAddress],
            },
            {
              contract: ContractName.Juicer,
              eventName: 'Pay',
              topics: [[], userAddress],
            },
          ]
        : []),
      ...(currentBudgetId
        ? [
            {
              contract: ContractName.Juicer,
              eventName: 'Tap',
              topics: [currentBudgetId],
            },
          ]
        : []),
    ],
    [userAddress, currentBudgetId],
  )

  const callback = useCallback(
    (budget?: Budget | null) => setCurrentBudgetId(budget?.id.toHexString()),
    [setCurrentBudgetId],
  )

  const formatter = useCallback(b => b ?? null, [])

  const valueDidChange = useCallback(
    (a, b) => budgetsDiff(a ?? undefined, b ?? undefined),
    [],
  )

  return useContractReader<Budget | null>({
    contract: ContractName.BudgetStore,
    functionName: 'getCurrentBudget',
    args: userAddress ? [userAddress] : null,
    valueDidChange,
    updateOn,
    callback,
    formatter,
  })
}
