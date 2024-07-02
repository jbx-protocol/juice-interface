import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import {
  SUPPORTED_SINGLE_TOKEN_PAYMENT_TERMINAL_STORES,
  SingleTokenPaymentTerminalStoreVersion,
  V2V3ContractName,
  V2V3Contracts,
} from 'packages/v2v3/models/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

export function useProjectPrimaryEthTerminalStore({
  JBETHPaymentTerminal,
}: {
  JBETHPaymentTerminal: Contract | undefined
}) {
  const { cv, contracts } = useContext(V2V3ContractsContext)
  const { value: storeAddress, loading } = useContractReadValue<string, string>(
    {
      contract: JBETHPaymentTerminal,
      functionName: 'store',
      args: [],
    },
  )

  const storeName = getStoreContractName(storeAddress, contracts)

  const JBETHPaymentTerminalStore = useLoadV2V3Contract({
    cv,
    address: storeAddress,
    contractName: storeName,
  })

  return { JBETHPaymentTerminalStore, loading }
}

const getStoreContractName = (
  address: string | undefined,
  contracts: V2V3Contracts | undefined,
): SingleTokenPaymentTerminalStoreVersion | undefined => {
  if (!address || !contracts) return undefined

  const storeName = SUPPORTED_SINGLE_TOKEN_PAYMENT_TERMINAL_STORES.find(
    contractName => {
      return isEqualAddress(
        address,
        // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
        contracts[contractName as V2V3ContractName]?.target as string,
      )
    },
  )

  return storeName
}
