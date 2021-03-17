import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { readProvider } from 'constants/read-provider'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useContext, useMemo, useState } from 'react'

import { mainnetProvider } from '../constants/mainnet-provider'

export function useWeth(
  signer?: JsonRpcSigner,
):
  | Partial<{
      contract: Contract
      symbol: string
      address: string
    }>
  | undefined {
  const { network } = useContext(UserContext)
  const [symbol, setSymbol] = useState<string>()

  const provider = useMemo(
    () =>
      process.env.NODE_ENV === 'production'
        ? mainnetProvider
        : readProvider(network),
    [network],
  )

  const address = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'weth',
  })

  const contract = useErc20Contract(address, signer ?? provider)

  useContractReader<string>({
    contract,
    functionName: 'symbol',
    callback: setSymbol,
  })

  return useMemo(
    () => ({
      contract,
      symbol,
      address,
    }),
    [contract, symbol, address],
  )
}
