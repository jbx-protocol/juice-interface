import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { NetworkContext } from 'contexts/networkContext'
import { ContractName } from 'models/contract-name'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

export function useContractLoader() {
  const [contracts, setContracts] = useState<Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

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
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = (
  contractName: ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract =>
  new Contract(
    require(`../contracts/${network}/${contractName}.address.js`),
    require(`../contracts/${network}/${contractName}.abi.js`),
    signerOrProvider,
  )
