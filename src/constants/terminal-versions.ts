import { constants } from 'ethers'
import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'

import { terminalV1_1Dict } from './terminalV1_1'

const terminalsForNetwork: Partial<
  Record<NetworkName, Record<number, string>>
> = {
  [NetworkName.rinkeby]: {
    1: require(`@jbx-protocol/contracts/deployments/${NetworkName.rinkeby}/${ContractName.TerminalV1}.json`)
      .address,
    1.1:
      terminalV1_1Dict[NetworkName.rinkeby]?.address ?? constants.AddressZero,
  },
  [NetworkName.mainnet]: {
    1: require(`@jbx-protocol/contracts/deployments/${NetworkName.mainnet}/${ContractName.TerminalV1}.json`)
      .address,
    1.1:
      terminalV1_1Dict[NetworkName.mainnet]?.address ?? constants.AddressZero,
  },
}

const terminals =
  terminalsForNetwork[process.env.REACT_APP_INFURA_NETWORK as NetworkName]

const terminalVersion = process.env.REACT_APP_TERMINAL_VERSION
  ? parseFloat(process.env.REACT_APP_TERMINAL_VERSION)
  : 1.1 // Default 1.1

export const terminalAddress = terminals
  ? terminals[terminalVersion]
  : constants.AddressZero
