import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import {
  SUPPORTED_SINGLE_TOKEN_PAYMENT_TERMINAL_STORES,
  SingleTokenPaymentTerminalStoreVersion,
  V2V3ContractName,
  V2V3Contracts,
} from 'models/v2v3/contracts'
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
        contracts[contractName as V2V3ContractName]?.address,
      )
    },
  )

  return storeName
}
