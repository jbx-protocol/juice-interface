import { CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { createContext, useContext } from 'react'

export interface PayoutsTableContextProps {
  payoutSplits: Split[]
  setPayoutSplits: (splits: Split[]) => void
  currency: CurrencyName
  setCurrency: (currency: CurrencyName) => void
  distributionLimit: number | undefined
  setDistributionLimit: (limit: number | undefined) => void
}

export const PayoutsTableContext = createContext<
  PayoutsTableContextProps | undefined
>(undefined)

export const usePayoutsTableContext = () => {
  const context = useContext(PayoutsTableContext)
  if (!context) {
    throw new Error(
      'usePayoutsTableContext must be used within a PayoutsTableProvider',
    )
  }
  return context
}
