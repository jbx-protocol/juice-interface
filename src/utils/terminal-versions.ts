import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'
import { TerminalVersion } from 'models/terminal-version'

import { readNetwork } from 'constants/networks'

const loadTerminalAddress = (network: NetworkName, terminal: ContractName) =>
  require(`@jbx-protocol/contracts-v1/deployments/${network}/${terminal}.json`)
    .address

export const getTerminalAddress = (
  version?: TerminalVersion,
): string | undefined => {
  if (!version) return
  const contractName = getTerminalName({ version })
  if (contractName) return loadTerminalAddress(readNetwork.name, contractName)
}

export const getTerminalVersion = (
  address?: string,
): TerminalVersion | undefined => {
  if (!address) return

  if (
    address === loadTerminalAddress(readNetwork.name, ContractName.TerminalV1)
  ) {
    return '1'
  }

  if (
    address === loadTerminalAddress(readNetwork.name, ContractName.TerminalV1_1)
  ) {
    return '1.1'
  }
}

export const getTerminalName = ({
  version,
  address,
}: {
  version?: TerminalVersion
  address?: string
}) => {
  if (!version && !address) return

  const _version =
    version ?? (address ? getTerminalVersion(address) : undefined)

  if (!_version) return

  switch (version) {
    case '1':
      return ContractName.TerminalV1
    case '1.1':
      return ContractName.TerminalV1_1
  }
}
