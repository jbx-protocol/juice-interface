import { readNetwork } from 'constants/networks'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { NetworkName } from 'models/networkName'
import { useContext } from 'react'

export function useDefaultJBETHPaymentTerminal() {
  const { contracts } = useContext(V2V3ContractsContext)

  // Temporary, testing.
  if (readNetwork.name === NetworkName.goerli) {
    return contracts?.JBETHPaymentTerminal3_1_1
  }

  return contracts?.JBETHPaymentTerminal3_1
}
