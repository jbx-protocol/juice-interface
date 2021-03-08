import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { ContractName } from 'constants/contract-name'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

export function useContractLoader(
  provider?: JsonRpcProvider,
  readOnly?: boolean,
) {
  const [contracts, setContracts] = useState<Contracts>()

  useDeepCompareEffect(() => {
    async function loadContracts() {
      if (!provider) return

      await provider.ready

      let network: NetworkName
      switch (provider.network.chainId) {
        case 1:
          network = NetworkName.mainnet
          break
        case 3:
          network = NetworkName.ropsten
          break
        default:
          network = NetworkName.localhost
      }

      if (!network) return

      try {
        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        // TODO how to automatically use signer if not using burner?
        const signerOrProvider = readOnly ? provider : provider.getSigner()

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
  }, [provider, readOnly, setContracts])

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
