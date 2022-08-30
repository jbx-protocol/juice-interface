import { createContext } from 'react'

type EtherPriceContextType = {
  ethInUsd: number
}

export const EtherPriceContext = createContext<EtherPriceContextType>({
  ethInUsd: 0,
})
