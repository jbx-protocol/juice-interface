import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import { V2ContractName, V2Contracts } from 'models/v2/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useV2ContractLoader() {
  const [contracts, setContracts] = useState<V2Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(V2ContractName).reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(
              contractName,
              network,
              signerOrProvider,
            ),
          }),
          {} as V2Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.log('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = (
  contractName: keyof typeof V2ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract | undefined => {
  console.warn('V2 Contract import aborted.')

  return undefined

  // let contract = require(`@jbx-protocol/contracts-v2/deployments/${network}/${contractName}.json`)
  // return new Contract(contract.address, contract.abi, signerOrProvider)
}
