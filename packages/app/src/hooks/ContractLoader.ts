import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { Contracts } from '../models/contracts'
import { NetworkName } from '../models/network-name'

const network: NetworkName =
  process.env.NODE_ENV === 'production'
    ? NetworkName.ropsten
    : (process.env.REACT_APP_DEV_NETWORK as NetworkName) ?? NetworkName.local

export function useContractLoader(signerOrProvider?: JsonRpcProvider | JsonRpcSigner) {
  const [contracts, setContracts] = useState<Contracts>()

  useEffect(() => {
    async function loadContracts() {
      if (signerOrProvider === undefined) return

      try {
        const signer =
          (await isProviderWithAccounts(signerOrProvider))?.getSigner() ?? (signerOrProvider as JsonRpcSigner)

        const contractList: ContractName[] = require(`../contracts/${network}/contracts.js`)

        const newContracts = contractList.reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(contractName, signer),
          }),
          {} as Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.log('ERROR LOADING CONTRACTS!!', e)
      }
    }

    loadContracts()
  }, [signerOrProvider])

  return contracts
}

async function isProviderWithAccounts(signerOrProvider: JsonRpcSigner | JsonRpcProvider) {
  if (
    (signerOrProvider as JsonRpcProvider).listAccounts !== undefined &&
    (await (signerOrProvider as JsonRpcProvider).listAccounts()).length > 0
  ) {
    return signerOrProvider as JsonRpcProvider
  }
}

const loadContract = (contractName: ContractName, signerOrProvider: JsonRpcSigner | JsonRpcProvider): Contract => {
  // TODO why does path not parse correctly when `../contracts/${network}` is stored as variable?
  const contract = new Contract(
    require(`../contracts/${network}/${contractName}.address.js`),
    require(`../contracts/${network}/${contractName}.abi.js`),
    signerOrProvider,
  )

  // const bytecode: string = require(`../contracts/${network}/${contractName}.bytecode.js`)

  return contract
}
