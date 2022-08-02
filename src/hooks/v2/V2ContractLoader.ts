import { NetworkContext } from 'contexts/networkContext'
import { V2ContractName, V2Contracts } from 'models/v2/contracts'
import { useContext, useEffect, useState } from 'react'

import { loadContract } from 'utils/contracts/loadContract'

import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'

export function useV2ContractLoader() {
  const [contracts, setContracts] = useState<V2Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const contractLoaders = await Promise.all(
          Object.values(V2ContractName).map(contractName =>
            loadContract(contractName, network, signerOrProvider),
          ),
        )

        const newContractMap = Object.values(V2ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: contractLoaders[idx],
          }),
          {} as V2Contracts,
        )

        setContracts(newContractMap)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}
