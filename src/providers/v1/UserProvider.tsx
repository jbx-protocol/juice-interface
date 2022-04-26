import { BigNumber } from '@ethersproject/bignumber'
import { V1UserContext } from 'contexts/v1/userContext'
import { useV1ContractLoader } from 'hooks/v1/V1ContractLoader'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { PropsWithChildren } from 'react'

export const V1UserProvider: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  const contracts = useV1ContractLoader()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <V1UserContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </V1UserContext.Provider>
  )
}
