import { createContext } from 'react'

export const WalletContext: React.Context<{
  connect?: VoidFunction
}> = createContext({})
