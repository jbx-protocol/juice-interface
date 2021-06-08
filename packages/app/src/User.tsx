import { BigNumber } from '@ethersproject/bignumber'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'

export default function User({ children }: { children: ChildElems }) {
  const contracts = useContractLoader()

  const gasPrice = useGasPrice('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const userAddress = useProviderAddress()

  return (
    <UserContext.Provider
      value={{
        contracts,
        transactor,
        userAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
