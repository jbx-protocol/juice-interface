import { CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { ReactNode, createContext, useContext } from 'react'

export interface PayoutsTableContextProps {
  payoutSplits: Split[]
  setPayoutSplits?: (payoutSplits: Split[]) => void
  currency: CurrencyName
  setCurrency?: (currency: CurrencyName) => void
  distributionLimit: number | undefined
  setDistributionLimit?: (distributionLimit: number | undefined) => void
  hideExplaination?: boolean
  hideHeader?: boolean
  showAvatars?: boolean
  topAccessory?: ReactNode
  hideSettings?: boolean
  addPayoutsDisabled?: boolean
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
