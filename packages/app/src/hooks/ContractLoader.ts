import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { useReadProvider } from 'hooks/ReadProvider'
import { ContractName } from 'models/contract-name'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

export function useContractLoader() {
  const [contracts, setContracts] = useState<Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  const readProvider = useReadProvider()

  useDeepCompareEffect(() => {
    async function loadContracts() {
      const _provider = signingProvider ?? readProvider

      await _provider.ready

      let network = NETWORKS[_provider.network.chainId]?.name

      if (!network) return

      try {
        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider
          ? signingProvider.getSigner()
          : readProvider

        const newContracts = contractList.reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(
              contractName,
              network,
              signerOrProvider,
            ),
          }),
          {} as Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.log('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [readProvider, signingProvider, setContracts])

  return contracts
}

const loadContract = (
  contractName: ContractName,
  network: NetworkName,
  signer: JsonRpcSigner | JsonRpcProvider,
): Contract =>
  new Contract(
    require(`../contracts/${network}/${contractName}.address.js`),
    require(`../contracts/${network}/${contractName}.abi.js`),
    signer,
  )
