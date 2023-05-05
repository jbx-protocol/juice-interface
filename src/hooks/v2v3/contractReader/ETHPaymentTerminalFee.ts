import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { useContext } from 'react'

export function useETHPaymentTerminalFee() {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useContractReadValue<string, BigNumber>({
    contract: contracts?.JBETHPaymentTerminal,
    functionName: 'fee',
    args: [],
  })
}
