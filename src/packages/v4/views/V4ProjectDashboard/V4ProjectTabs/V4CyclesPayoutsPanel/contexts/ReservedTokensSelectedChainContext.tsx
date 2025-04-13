import { JBChainId, useJBChainId } from 'juice-sdk-react'
import { createContext, useContext, useEffect } from 'react'

import { useState } from 'react'

type ReservedTokensSelectedChainContextType = {
  selectedChainId: JBChainId | undefined
  setSelectedChainId: (chainId: JBChainId) => void
}

export const ReservedTokensSelectedChainContext = createContext<ReservedTokensSelectedChainContextType>({
  selectedChainId: undefined,
  setSelectedChainId: () => {
    console.error('ReservedTokensSelectedChainContext.setSelectedChainId called but no provider set')
  },
})

export const ReservedTokensSelectedChainProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>()
  const projectPageChainId = useJBChainId()

  useEffect(() => {
    setSelectedChainId(projectPageChainId)
  }, [projectPageChainId])

  return (
    <ReservedTokensSelectedChainContext.Provider
      value={{
        selectedChainId,
        setSelectedChainId
      }}
    >
      {children}
    </ReservedTokensSelectedChainContext.Provider>
  )
}

export const useReservedTokensSelectedChain = () => {
  const context = useContext(ReservedTokensSelectedChainContext)
  if (!context) {
    throw new Error(
      'useReservedTokensSelectedChain must be used within a ReservedTokensSelectedChainProvider',
    )
  }
  return context
}
