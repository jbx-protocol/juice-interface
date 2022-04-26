import { BigNumber } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useV2ContractLoader } from 'hooks/v2/V2ContractLoader'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { PropsWithChildren } from 'react'

export const V2UserProvider: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  const contracts = useV2ContractLoader()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <V2UserContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </V2UserContext.Provider>
  )
}
