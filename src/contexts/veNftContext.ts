import { createContext } from 'react'

export type VeNftContextType = {
  contractAddress: string | undefined
}

export const VeNftContext = createContext<VeNftContextType>({
  contractAddress: undefined,
})
