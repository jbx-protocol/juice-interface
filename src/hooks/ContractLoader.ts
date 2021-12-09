import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import { Contracts } from 'models/contracts'
import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'
import { terminalV1_1Dict } from 'constants/terminalV1_1'

export function useContractLoader() {
  const [contracts, setContracts] = useState<Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(ContractName).reduce(
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
  contractName: string,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract => {
  // TODO this is a temporary override for terminalV1_1 artifacts
  const terminalV1_1 = terminalV1_1Dict[network]

  if (contractName === ContractName.TerminalV1_1 && terminalV1_1) {
    return new Contract(
      terminalV1_1.address,
      terminalV1_1.abi,
      signerOrProvider,
    )
  }

  let contract = require(`@jbx-protocol/contracts/deployments/${network}/${contractName}.json`)
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
