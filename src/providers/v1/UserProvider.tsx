import { BigNumber } from '@ethersproject/bignumber'
import { V1UserContext } from 'contexts/v1/userContext'
import { useV1ContractLoader } from 'hooks/v1/V1ContractLoader'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'

export const V1UserProvider: React.FC = ({ children }) => {
  const contracts = useV1ContractLoader()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const version = 'v1'

  return (
    <V1UserContext.Provider
      value={{
        contracts,
        transactor,
        version,
      }}
    >
      {children}
    </V1UserContext.Provider>
  )
}
