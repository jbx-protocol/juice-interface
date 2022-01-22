import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import {
  JuiceboxV2ContractName,
  JuiceboxV2Contracts,
} from 'models/contracts/juiceboxV2'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useContractLoaderV2() {
  const [contracts, setContracts] = useState<JuiceboxV2Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(JuiceboxV2ContractName).reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(
              contractName,
              network,
              signerOrProvider,
            ),
          }),
          {} as JuiceboxV2Contracts,
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
  contractName: string,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract => {
  const contract = require(`@jbx-protocol/contracts-v2/deployments/${network}/${contractName}.json`) // TODO update to V2
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
