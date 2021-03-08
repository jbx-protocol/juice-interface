import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { localProvider } from 'constants/local-provider'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { NetworkName } from 'models/network-name'
import { useMemo, useState } from 'react'

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
  const [symbol, setSymbol] = useState<string>()

  const provider = useMemo(
    () =>
      process.env.NODE_ENV === 'production' ||
      (process.env.REACT_APP_INFURA_DEV_NETWORK &&
        process.env.REACT_APP_INFURA_DEV_NETWORK !== NetworkName.localhost)
        ? mainnetProvider
        : localProvider,
    [],
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
