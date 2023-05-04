import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export function useProjectPrimaryEthTerminalStore({
  JBETHPaymentTerminal,
}: {
  JBETHPaymentTerminal: Contract | undefined
}) {
  const { cv } = useContext(V2V3ContractsContext)
  const { value: storeAddress, loading } = useContractReadValue<string, string>(
    {
      contract: JBETHPaymentTerminal,
      functionName: 'store',
      args: [],
    },
  )

  const JBETHPaymentTerminalStore = useLoadV2V3Contract({
    cv,
    contractName: V2V3ContractName.JBSingleTokenPaymentTerminalStore,
    address: storeAddress,
  })

  return { JBETHPaymentTerminalStore, loading }
}
