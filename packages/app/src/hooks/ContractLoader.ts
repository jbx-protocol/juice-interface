import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { ContractName } from 'models/contract-name'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useReadProvider } from 'utils/providers'

export function useContractLoader(
  provider?: JsonRpcProvider,
  network?: NetworkName,
) {
  const [contracts, setContracts] = useState<Contracts>()

  const readProvider = useReadProvider(network)

  useDeepCompareEffect(() => {
    async function loadContracts() {
      const _provider = provider ?? readProvider

      await _provider.ready

      let network = NETWORKS[_provider.network.chainId]?.name

      if (!network) return

      try {
        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        // TODO how to automatically use signer if not using burner?
        const signerOrProvider = provider?.getSigner() ?? readProvider

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
  }, [provider, setContracts])

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
