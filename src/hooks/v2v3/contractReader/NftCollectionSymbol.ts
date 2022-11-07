import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { useWallet } from 'hooks/Wallet'
import { useEffect, useState } from 'react'
import { loadJBTiered721DelegateContract } from 'utils/v2v3/contractLoaders/JBTiered721Delegate'

import useV2ContractReader from './V2ContractReader'

export function useNftCollectionSymbol(dataSourceAddress: string | undefined) {
  const { signer } = useWallet()

  const [delegateContract, setDelegateContract] = useState<Contract>()
  useEffect(() => {
    async function fetchDataSourceContract() {
      if (!dataSourceAddress) return
      const _delegateContract = await loadJBTiered721DelegateContract(
        dataSourceAddress,
        signer ?? readProvider,
      )
      setDelegateContract(_delegateContract)
    }
    fetchDataSourceContract()
  }, [dataSourceAddress, signer])
  return useV2ContractReader<string>({
    contract: delegateContract,
    functionName: 'symbol',
    args: [],
  })
}
