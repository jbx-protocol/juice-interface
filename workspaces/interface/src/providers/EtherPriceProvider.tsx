import { EtherPriceContext } from 'contexts/EtherPriceContext'
import { useEtherPrice } from 'hooks/EtherPrice'

export const EtherPriceProvider: React.FC = ({ children }) => {
  const ethInUsd = useEtherPrice()
  return (
    <EtherPriceContext.Provider value={{ ethInUsd }}>
      {children}
    </EtherPriceContext.Provider>
  )
}
