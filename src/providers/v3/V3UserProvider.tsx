import { BigNumber } from '@ethersproject/bignumber'
import { V3UserContext } from 'contexts/v3/userContext'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { useV3ContractLoader } from 'hooks/v3/V3ContractLoader'

export const V3UserProvider: React.FC = ({ children }) => {
  const contracts = useV3ContractLoader()
  const { data: gasPrice } = useGasPriceQuery('average')
  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const version = 'v3'

  return (
    <V3UserContext.Provider
      value={{
        contracts,
        transactor,
        version,
      }}
    >
      {children}
    </V3UserContext.Provider>
  )
}
