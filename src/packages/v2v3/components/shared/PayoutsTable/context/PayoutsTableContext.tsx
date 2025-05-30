import { ReactNode, createContext, useContext } from 'react'

import { CurrencyName } from 'constants/currency'
import { TreasurySelection } from 'models/treasurySelection'
import { Split } from 'packages/v2v3/models/splits'

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
  usdDisabled?: boolean
  // TODO: Hack to allow the create payouts table to hide data if set to none.
  createTreasurySelection?: TreasurySelection
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
