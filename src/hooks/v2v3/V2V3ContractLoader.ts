import { useWallet } from 'hooks/Wallet'
import { V2V3ContractName, V2V3Contracts } from 'models/v2v3/contracts'
import { useEffect, useState } from 'react'

import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { CV2V3 } from 'models/cv'
import { emitErrorNotification } from 'utils/notifications'

export function useV2V3ContractLoader({ cv }: { cv: CV2V3 }) {
  const { signer } = useWallet()
  const [contracts, setContracts] = useState<V2V3Contracts>()

  useEffect(() => {
    async function loadContracts() {
      console.info(`Loading v${cv} contracts...`)
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signer ?? readProvider

        const contractLoaders = await Promise.all(
          Object.values(V2V3ContractName).map(contractName =>
            loadV2V3Contract(contractName, network, signerOrProvider, cv),
          ),
        )

        const newContractMap = Object.values(V2V3ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: contractLoaders[idx],
          }),
          {} as V2V3Contracts,
        )

        setContracts(newContractMap)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
        emitErrorNotification(
          'Failed to load contracts. Change network or refresh page.',
        )
      }
    }

    loadContracts()
  }, [setContracts, signer, cv])

  return contracts
}
