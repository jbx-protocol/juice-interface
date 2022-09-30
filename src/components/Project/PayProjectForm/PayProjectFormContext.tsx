import { BigNumber } from '@ethersproject/bignumber'
import { createContext } from 'react'
import { WeightFunction } from 'utils/math'
import { PayButtonProps } from './PayProjectForm'

interface PayProjectFormContextType {
  PayButton: undefined | ((props: PayButtonProps) => JSX.Element | null)
  reservedRate: number | undefined
  weight: BigNumber | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  weightingFn: WeightFunction | undefined
  isEligibleForNft?: boolean
}

export const PayProjectFormContext = createContext<PayProjectFormContextType>({
  PayButton: undefined,
  reservedRate: undefined,
  weight: undefined,
  tokenSymbol: undefined,
  tokenAddress: undefined,
  weightingFn: undefined,
})
