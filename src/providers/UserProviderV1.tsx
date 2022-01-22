import { BigNumber } from '@ethersproject/bignumber'
import { UserContextV1 } from 'contexts/v1/userContextV1'
import { useContractLoaderV1 } from 'hooks/v1/ContractLoaderV1'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'

export default function UserProviderV1({ children }: { children: ChildElems }) {
  const contracts = useContractLoaderV1()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <UserContextV1.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </UserContextV1.Provider>
  )
}
