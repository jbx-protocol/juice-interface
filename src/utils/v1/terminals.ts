import { NetworkName } from 'models/networkName'
import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalVersion } from 'models/v1/terminals'

import { V1TerminalName } from 'models/v1/terminals'

import { readNetwork } from 'constants/networks'
import { isEqualAddress } from 'utils/address'

const loadTerminalAddress = (
  network: NetworkName,
  terminal: V1TerminalName | null,
): string | undefined => {
  // NOTE: This require is harder to easily change in the code base as it means
  // making changes to the way the functions in the file are called.
  if (terminal === 'TerminalV1_1') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`@jbx-protocol/contracts-v1/deployments/${network}/TerminalV1_1.json`)
      .address
  }
  if (terminal === 'TerminalV1') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`@jbx-protocol/contracts-v1/deployments/${network}/TerminalV1.json`)
      .address
  }
}

export const getTerminalAddress = (
  version?: V1TerminalVersion,
): string | undefined => {
  if (!version) return
  const contractName = getTerminalName({ version })
  if (contractName) return loadTerminalAddress(readNetwork.name, contractName)
}

export const getTerminalVersion = (
  address?: string | null,
): V1TerminalVersion | undefined => {
  if (!address) return

  if (
    isEqualAddress(
      address,
      loadTerminalAddress(readNetwork.name, V1ContractName.TerminalV1),
    )
  ) {
    return '1'
  }

  if (
    isEqualAddress(
      address,
      loadTerminalAddress(readNetwork.name, V1ContractName.TerminalV1_1),
    )
  ) {
    return '1.1'
  }
}

export const getTerminalName = ({
  version,
  address,
}: {
  version?: V1TerminalVersion
  address?: string
}): V1TerminalName | undefined => {
  if (!version && !address) return

  const _version =
    version ?? (address ? getTerminalVersion(address) : undefined)

  if (!_version) return

  switch (_version) {
    case '1':
      return V1ContractName.TerminalV1
    case '1.1':
      return V1ContractName.TerminalV1_1
  }
}
