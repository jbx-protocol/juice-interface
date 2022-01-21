import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { NetworkName } from 'models/network-name'
import { TerminalVersion } from 'models/terminal-version'

import { readNetwork } from 'constants/networks'

const loadTerminalAddress = (
  network: NetworkName,
  terminal: JuiceboxV1ContractName,
): string =>
  require(`@jbx-protocol/contracts-v1/deployments/${network}/${terminal}.json`)
    .address

export const getTerminalAddress = (
  version?: TerminalVersion,
): string | undefined => {
  if (!version) return
  const JuiceboxV1ContractName = getTerminalName({ version })
  if (JuiceboxV1ContractName)
    return loadTerminalAddress(readNetwork.name, JuiceboxV1ContractName)
}

export const getTerminalVersion = (
  address?: string,
): TerminalVersion | undefined => {
  if (!address) return

  if (
    address.toLowerCase() ===
    loadTerminalAddress(
      readNetwork.name,
      JuiceboxV1ContractName.TerminalV1,
    ).toLowerCase()
  ) {
    return '1'
  }

  if (
    address.toLowerCase() ===
    loadTerminalAddress(
      readNetwork.name,
      JuiceboxV1ContractName.TerminalV1_1,
    ).toLowerCase()
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

  switch (_version) {
    case '1':
      return JuiceboxV1ContractName.TerminalV1
    case '1.1':
      return JuiceboxV1ContractName.TerminalV1_1
  }
}
