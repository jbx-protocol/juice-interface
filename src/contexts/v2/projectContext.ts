import { BigNumber } from '@ethersproject/bignumber'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
})
