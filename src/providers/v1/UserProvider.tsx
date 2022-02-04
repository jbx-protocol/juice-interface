import { BigNumber } from '@ethersproject/bignumber'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContractLoader } from 'hooks/v1/ContractLoader'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'

export default function V1UserProvider({ children }: { children: ChildElems }) {
  const contracts = useContractLoader()

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
