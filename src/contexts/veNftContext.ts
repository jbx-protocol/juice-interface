import { createContext } from 'react'

type VeNftContextType = {
  contractAddress: string | undefined
}

export const VeNftContext = createContext<VeNftContextType>({
  contractAddress: undefined,
})
