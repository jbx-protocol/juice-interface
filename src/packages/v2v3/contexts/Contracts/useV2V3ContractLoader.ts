import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { useWallet } from 'hooks/Wallet'
import { V2V3ContractName, V2V3Contracts } from 'packages/v2v3/models/contracts'
import { CV2V3 } from 'packages/v2v3/models/cv'
import { loadV2V3Contract } from 'packages/v2v3/utils/loadV2V3Contract'
import { useEffect, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function useV2V3ContractLoader({ cv }: { cv: CV2V3 | undefined }) {
  const { signer } = useWallet()
  const [contracts, setContracts] = useState<V2V3Contracts>()

  useEffect(() => {
    async function loadContracts() {
      if (!cv) return

      const timeLabel = `v${cv} contracts loaded`
      console.time(timeLabel)
      try {
        const network = readNetwork.name

        const contractLoaders = await Promise.all(
          Object.values(V2V3ContractName).map(contractName =>
            loadV2V3Contract(contractName, network, readProvider, cv),
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
        console.timeEnd(timeLabel)
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
