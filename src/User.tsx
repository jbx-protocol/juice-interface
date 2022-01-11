import { BigNumber } from '@ethersproject/bignumber'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'

export default function User({ children }: { children: ChildElems }) {
  const contracts = useContractLoader()

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <UserContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
