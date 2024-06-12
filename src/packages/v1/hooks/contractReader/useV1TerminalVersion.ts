import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { V1TerminalVersion } from 'packages/v1/models/terminals'
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
