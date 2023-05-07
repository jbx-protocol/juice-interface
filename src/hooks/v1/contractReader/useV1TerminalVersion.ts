import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'

export function useV1TerminalVersion({
  terminalAddress,
}: {
  terminalAddress: string | undefined
}): {
  version: V1TerminalVersion | undefined
  name: V1ContractName.TerminalV1 | V1ContractName.TerminalV1_1 | undefined
} {
  const { contracts } = useContext(V1UserContext)
  if (!terminalAddress) return { name: undefined, version: undefined }

  if (isEqualAddress(terminalAddress, contracts?.TerminalV1.address)) {
    return { version: '1', name: V1ContractName.TerminalV1 }
  }

  if (isEqualAddress(terminalAddress, contracts?.TerminalV1_1.address)) {
    return { version: '1.1', name: V1ContractName.TerminalV1_1 }
  }

  return { name: undefined, version: undefined }
}
