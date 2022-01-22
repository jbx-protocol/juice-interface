import { BigNumber } from '@ethersproject/bignumber'
import { UserContextV2 } from 'contexts/v2/userContextV2'
import { useContractLoaderV2 } from 'hooks/v2/ContractLoaderV2'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'

export default function UserProviderV2({ children }: { children: ChildElems }) {
  const contracts = useContractLoaderV2()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <UserContextV2.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </UserContextV2.Provider>
  )
}
