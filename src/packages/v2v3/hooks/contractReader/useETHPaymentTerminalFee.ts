import { useContractReadValue } from 'hooks/ContractReader'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'

export function useETHPaymentTerminalFee() {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useContractReadValue<string, bigint>({
    contract: contracts?.JBETHPaymentTerminal,
    functionName: 'fee',
    args: [],
  })
}
