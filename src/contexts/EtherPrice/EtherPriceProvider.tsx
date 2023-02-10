import { EtherPriceContext } from 'contexts/EtherPrice/EtherPriceContext'
import { useEtherPrice } from 'contexts/EtherPrice/EtherPrice'

export const EtherPriceProvider: React.FC = ({ children }) => {
  const ethInUsd = useEtherPrice()
  return (
    <EtherPriceContext.Provider value={{ ethInUsd }}>
      {children}
    </EtherPriceContext.Provider>
  )
}
