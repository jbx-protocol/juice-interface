import { useEtherPrice } from 'contexts/EtherPrice/EtherPrice'
import { EtherPriceContext } from 'contexts/EtherPrice/EtherPriceContext'

export const EtherPriceProvider: React.FC = ({ children }) => {
  const { data } = useEtherPrice()
  return (
    <EtherPriceContext.Provider value={{ ethInUsd: data || 0 }}>
      {children}
    </EtherPriceContext.Provider>
  )
}
