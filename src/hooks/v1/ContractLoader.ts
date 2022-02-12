import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { NetworkContext } from 'contexts/networkContext'
import { V1ContractName } from 'models/v1/contracts'
import { V1Contracts } from 'models/v1/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { CONTRACTS_MAINNET } from './contracts.mainnet'
import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'
import { CONTRACTS_RINKEBY } from './contracts.rinkeby'

const CONTRACTS =
  process.env.REACT_APP_INFURA_NETWORK === 'mainnet'
    ? CONTRACTS_MAINNET
    : CONTRACTS_RINKEBY

export function useContractLoader() {
  const [contracts, setContracts] = useState<V1Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(V1ContractName).map(contractName => {
          return loadContract(contractName, network, signerOrProvider)
        })

        const newContractsMap = Object.values(V1ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: newContracts[idx],
          }),
          {} as V1Contracts,
        )

        setContracts(newContractsMap)
      } catch (e) {
        console.log('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = (
  contractName: keyof typeof V1ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract => {
  const contract = CONTRACTS[contractName]
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
