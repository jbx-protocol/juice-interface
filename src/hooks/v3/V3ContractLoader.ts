import { useWallet } from 'hooks/Wallet'
import { V3ContractName, V3Contracts } from 'models/v3/contracts'
import { useEffect, useState } from 'react'

import { loadContract } from 'utils/contracts/v3/loadContract'

import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'

export function useV3ContractLoader() {
  const { signer } = useWallet()
  const [contracts, setContracts] = useState<V3Contracts>()

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signer ?? readProvider

        const contractLoaders = await Promise.all(
          Object.values(V3ContractName).map(contractName =>
            loadContract(contractName, network, signerOrProvider),
          ),
        )

        const newContractMap = Object.values(V3ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: contractLoaders[idx],
          }),
          {} as V3Contracts,
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
