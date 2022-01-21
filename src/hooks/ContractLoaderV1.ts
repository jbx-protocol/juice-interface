import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import {
  JuiceboxV1ContractName,
  JuiceboxV1Contracts,
} from 'models/contracts/juiceboxV1'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useContractLoaderV1() {
  const [contracts, setContracts] = useState<JuiceboxV1Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(JuiceboxV1ContractName).reduce(
          (accumulator, JuiceboxV1ContractName) => ({
            ...accumulator,
            [JuiceboxV1ContractName]: loadContract(
              JuiceboxV1ContractName,
              network,
              signerOrProvider,
            ),
          }),
          {} as JuiceboxV1Contracts,
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
  JuiceboxV1ContractName: string,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract => {
  let contract = require(`@jbx-protocol/contracts-v1/deployments/${network}/${JuiceboxV1ContractName}.json`)
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
