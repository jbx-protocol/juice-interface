import { JBChainId, useJBChainId } from 'juice-sdk-react'
import { createContext, useContext, useEffect } from 'react'

import { useState } from 'react'

type CyclesPanelSelectedChainContextType = {
  selectedChainId: JBChainId | undefined
  setSelectedChainId: (chainId: JBChainId) => void
}

export const CyclesPanelSelectedChainContext = createContext<CyclesPanelSelectedChainContextType>({
  selectedChainId: 84532, // v4TODO
  setSelectedChainId: () => {
    console.error('CyclesPanelSelectedChainContext.setSelectedChainId called but no provider set')
  },
})

export const CyclesPanelSelectedChainProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>()

  const projectPageChainId = useJBChainId()

  useEffect(() => {
    setSelectedChainId(projectPageChainId)
  }, [projectPageChainId])

  return (
    <CyclesPanelSelectedChainContext.Provider
      value={{
        selectedChainId,
        setSelectedChainId
      }}
    >
      {children}
    </CyclesPanelSelectedChainContext.Provider>
  )
}

export const useCyclesPanelSelectedChain = () => {
  const context = useContext(CyclesPanelSelectedChainContext)
  if (!context) {
    throw new Error(
      'useCyclesPanelSelectedChain must be used within a CyclesPanelSelectedChainProvider',
    )
  }
  return context
}
