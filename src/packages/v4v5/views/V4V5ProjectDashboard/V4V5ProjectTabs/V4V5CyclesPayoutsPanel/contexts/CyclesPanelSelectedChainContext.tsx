import { JBChainId, useJBChainId } from 'juice-sdk-react'
import { createContext, forwardRef, useContext, useEffect, useState } from 'react'

type CyclesPanelSelectedChainContextType = {
  selectedChainId: JBChainId | undefined
  setSelectedChainId: (chainId: JBChainId) => void
}

export const CyclesPanelSelectedChainContext = createContext<CyclesPanelSelectedChainContextType>({
  selectedChainId: undefined,
  setSelectedChainId: () => {
    console.error('CyclesPanelSelectedChainContext.setSelectedChainId called but no provider set')
  },
})

export const CyclesPanelSelectedChainProvider = forwardRef<HTMLDivElement, React.PropsWithChildren<unknown>>(({
  children,
}, ref) => {
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>()
  const projectPageChainId = useJBChainId()

  useEffect(() => {
    setSelectedChainId(projectPageChainId)
  }, [projectPageChainId])

  return (
    <div ref={ref}>
      <CyclesPanelSelectedChainContext.Provider
        value={{
          selectedChainId,
          setSelectedChainId
        }}
      >
        {children}
      </CyclesPanelSelectedChainContext.Provider>
    </div>
  )
})

CyclesPanelSelectedChainProvider.displayName = 'CyclesPanelSelectedChainProvider'

export const useCyclesPanelSelectedChain = () => {
  const context = useContext(CyclesPanelSelectedChainContext)
  if (!context) {
    throw new Error(
      'useCyclesPanelSelectedChain must be used within a CyclesPanelSelectedChainProvider',
    )
  }
  return context
}
