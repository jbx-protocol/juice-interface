import { JsonRpcProvider } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { Budget } from 'models/budget'
import { useCallback, useMemo, useState } from 'react'
import { budgetsDiff } from 'utils/budgetsDiff'
import { serializeBudget } from 'utils/serializers'

import { userBudgetActions } from '../redux/slices/userBudget'
import { useAppDispatch } from './AppDispatch'
import useContractReader from './ContractReader'

export function useUserBudget(
  userAddress?: string,
  provider?: JsonRpcProvider,
) {
  const [userBudgetId, setUserBudgetId] = useState<string>()
  const dispatch = useAppDispatch()

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
      ...(userBudgetId
        ? [
            {
              contract: ContractName.Juicer,
              eventName: 'Tap',
              topics: [userBudgetId],
            },
          ]
        : []),
    ],
    [userAddress, userBudgetId],
  )

  const callback = useCallback(
    (budget?: Budget | null | undefined) => {
      setUserBudgetId(budget?.id.toHexString())
      dispatch(userBudgetActions.set(budget ? serializeBudget(budget) : null))
    },
    [setUserBudgetId, dispatch],
  )

  const valueDidChange = useCallback((a, b) => budgetsDiff(a, b), [])

  return useContractReader<Budget | null>({
    contract: ContractName.BudgetStore,
    functionName: 'getCurrentBudget',
    args: userAddress ? [userAddress] : null,
    valueDidChange,
    updateOn,
    callback,
    provider,
  })
}
