import { useSigner } from 'wagmi'
import { V2ContractName, V2Contracts } from 'models/v2/contracts'
import { useEffect, useState } from 'react'

import { loadContract } from 'utils/contracts/loadContract'

import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'

export function useV2ContractLoader() {
  const { data: signer } = useSigner()
  const [contracts, setContracts] = useState<V2Contracts>()

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signer ?? readProvider

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
  }, [setContracts, signer])

  return contracts
}
