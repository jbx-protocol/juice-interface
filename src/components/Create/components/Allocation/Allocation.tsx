import { BigNumber } from '@ethersproject/bignumber'
import { FormItemInput } from 'models/formItemInput'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { createContext, useContext } from 'react'
import { AllocationItem } from './AllocationItem'
import { AllocationList } from './AllocationList'
import { useAllocation } from './hooks/Allocation'

export type AllocationSplit = Split & { id: string }

const DEFAULT_SET_CURRENCY_FN = () => {
  console.error('AllocationContext.setCurrency called but no provider set')
}

const AllocationContext = createContext<{
  allocations: AllocationSplit[]
  totalAllocationAmount?: BigNumber
  allocationCurrency?: V2V3CurrencyOption
  addAllocation: (allocation: AllocationSplit) => void
  removeAllocation: (id: string) => void
  upsertAllocation: (allocation: AllocationSplit) => void
  setCurrency: (currency: V2V3CurrencyOption) => void
}>({
  allocations: [],
  addAllocation: () => {
    console.error('AllocationContext.addAllocation called but no provider set')
  },
  removeAllocation: () => {
    console.error(
      'AllocationContext.removeAllocation called but no provider set',
    )
  },
  upsertAllocation: () => {
    console.error(
      'AllocationContext.upsertAllocation called but no provider set',
    )
  },
  setCurrency: DEFAULT_SET_CURRENCY_FN,
})

const useAllocationInstance = () => {
  return useContext(AllocationContext)
}

export interface AllocationProps {
  totalAllocationAmount?: BigNumber
  allocationCurrency?: V2V3CurrencyOption
  setAllocationCurrency?: (currency: V2V3CurrencyOption) => void
}

export const Allocation: React.FC<
  AllocationProps & FormItemInput<AllocationSplit[]>
> & {
  List: typeof AllocationList
  Item: typeof AllocationItem
  useAllocationInstance: typeof useAllocationInstance
} = ({
  totalAllocationAmount,
  allocationCurrency,
  value,
  onChange,
  setAllocationCurrency,
  children,
}) => {
  const allocationHook = useAllocation({ value, onChange })

  return (
    <AllocationContext.Provider
      value={{
        ...allocationHook,
        totalAllocationAmount,
        allocationCurrency,
        setCurrency: setAllocationCurrency ?? DEFAULT_SET_CURRENCY_FN,
      }}
    >
      {children}
    </AllocationContext.Provider>
  )
}

Allocation.useAllocationInstance = useAllocationInstance
Allocation.List = AllocationList
Allocation.Item = AllocationItem
