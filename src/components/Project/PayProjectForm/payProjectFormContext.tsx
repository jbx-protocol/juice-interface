import { BigNumber } from 'ethers'
import { createContext } from 'react'
import { WeightFunction } from 'utils/math'
import { PayProjectForm } from './hooks/usePayProjectForm'

export interface PayButtonProps {
  disabled?: boolean
  wrapperClassName?: string
}

interface PayProjectFormContextType {
  PayButton: undefined | ((props: PayButtonProps) => JSX.Element | null)
  reservedRate: number | undefined
  weight: BigNumber | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  weightingFn: WeightFunction | undefined
  form: PayProjectForm | undefined
}

export const PayProjectFormContext = createContext<PayProjectFormContextType>({
  PayButton: undefined,
  reservedRate: undefined,
  weight: undefined,
  tokenSymbol: undefined,
  tokenAddress: undefined,
  weightingFn: undefined,
  form: undefined,
})
