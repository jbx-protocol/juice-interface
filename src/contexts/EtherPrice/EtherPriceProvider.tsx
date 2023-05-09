import { EtherPriceContext } from 'contexts/EtherPrice/EtherPriceContext'
import { useEtherPrice } from 'contexts/EtherPrice/useEtherPrice'

export const EtherPriceProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { data } = useEtherPrice()
  return (
    <EtherPriceContext.Provider value={{ ethInUsd: data || 0 }}>
      {children}
    </EtherPriceContext.Provider>
  )
}
