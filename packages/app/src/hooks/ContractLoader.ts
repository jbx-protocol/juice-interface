import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { Contracts } from '../models/contracts'
import { NetworkName } from '../models/network-name'

export function useContractLoader(provider?: JsonRpcProvider) {
  const [contracts, setContracts] = useState<Contracts>()

  useEffect(() => {
    async function loadContracts() {
      if (!provider) return

      await provider.ready

      const network = provider.network?.name as NetworkName

      if (!network) return

      try {
        const signer = provider.getSigner()

        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        const newContracts = contractList.reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(contractName, signer, network),
          }),
          {} as Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.log('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [provider])

  return contracts
}

const loadContract = (
  contractName: ContractName,
  signer: JsonRpcSigner,
  network: NetworkName,
): Contract =>
  new Contract(
    require(`../contracts/${network}/${contractName}.address.js`),
    require(`../contracts/${network}/${contractName}.abi.js`),
    signer,
  )
