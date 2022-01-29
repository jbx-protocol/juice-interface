import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { JuiceboxV1Contracts } from 'models/v1/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useContractLoader() {
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
  contractName: keyof typeof JuiceboxV1ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract => {
  let contract = require(`@jbx-protocol/contracts-v1/deployments/${network}/${contractName}.json`)
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
