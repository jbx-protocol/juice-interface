import { BigNumber } from 'ethers'
import { FormItemInput } from 'models/formItemInput'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { createContext, useContext } from 'react'
import { AllocationItem } from './AllocationItem'
import { AllocationList } from './AllocationList'
import { useAllocation } from './hooks/useAllocation'

export type AllocationSplit = Split & { id: string }

const DEFAULT_SET_CURRENCY_FN = () => {
  console.error('AllocationContext.setCurrency called but no provider set')
}

const AllocationContext = createContext<{
  allocations: AllocationSplit[]
  totalAllocationAmount?: BigNumber
  setTotalAllocationAmount?: (total: BigNumber) => void
  allocationCurrency?: V2V3CurrencyOption
  addAllocation: (allocation: AllocationSplit) => void
  removeAllocation: (id: string) => void
  upsertAllocation: (allocation: AllocationSplit) => void
  setAllocations: (allocations: AllocationSplit[]) => void
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
  setAllocations: () => {
    console.error('AllocationContext.setAllocations called but no provider set')
  },
  setCurrency: DEFAULT_SET_CURRENCY_FN,
})

const useAllocationInstance = () => {
  return useContext(AllocationContext)
}

interface AllocationProps {
  totalAllocationAmount?: BigNumber
  setTotalAllocationAmount?: (total: BigNumber) => void
  allocationCurrency?: V2V3CurrencyOption
  setAllocationCurrency?: (currency: V2V3CurrencyOption) => void
}

export const Allocation: React.FC<
  React.PropsWithChildren<AllocationProps & FormItemInput<AllocationSplit[]>>
> & {
  List: typeof AllocationList
  Item: typeof AllocationItem
  useAllocationInstance: typeof useAllocationInstance
} = ({
  totalAllocationAmount,
  setTotalAllocationAmount,
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
        setTotalAllocationAmount,
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
