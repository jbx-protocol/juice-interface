import { BigNumber } from '@ethersproject/bignumber'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'
import { useContext } from 'react'

export default function User({ children }: { children: ChildElems }) {
  const { signingProvider } = useContext(NetworkContext)

  const contracts = useContractLoader()

  const gasPrice = useGasPrice('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const userAddress = useProviderAddress(signingProvider)

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
