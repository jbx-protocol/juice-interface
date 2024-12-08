import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'

/**
 * Defines the ABI filename to use for a given V2V3ContractName.
 */
const V2_CONTRACT_ABI_OVERRIDES: {
  [k in V2V3ContractName]?: {
    addresses?: {
      [k in NetworkName]?: string
    }
  }
} = {
  JBETHERC20ProjectPayerDeployer: {
    /**
     * This deployment of the JBETHERC20ProjectPayerDeployer has slightly different
     * internals to the one in the contracts-v2-latest package.
     *
     * It sets the beneficiary to tx.origin, instead of msg.sender.
     *
     * It was only deployed on mainnet, so we'll override it for mainnet only.
     */
    addresses: {
      [NetworkName.mainnet]: '0x325Ba0eFC2c750e0317561e79cFa6911e29B24CC',
    },
  },
  JBOperatorStore: {
    addresses: {
      [NetworkName.sepolia]: '0x8f63c744c0280ef4b32af1f821c65e0fd4150ab3',
    },
  },
  JBProjects: {
    addresses: {
      [NetworkName.sepolia]: '0x43CB8FCe4F0d61579044342A5d5A027aB7aE4D63',
    },
  },
  JBDirectory: {
    addresses: {
      [NetworkName.sepolia]: '0x3B3Bd16cc76cd53218e00b600bFCa27aA5057794',
    },
  },
  JBFundingCycleStore: {
    addresses: {
      [NetworkName.sepolia]: '0xCb881e166d527010B9eF11159b487f907040D7C4',
    },
  },
  JBTokenStore: {
    addresses: {
      [NetworkName.sepolia]: '0x25fdda0eBD9e979b8c1657780045Cf87392a14E4',
    },
  },
  JBSplitsStore: {
    addresses: {
      [NetworkName.sepolia]: '0xEdE89dB755855aF041b5f100B39db9324b5227Ac',
    },
  },
  JBController: {
    addresses: {
      [NetworkName.sepolia]: '0x0c750ac5805AC3357b72554e3AE70840BBD09A98',
    },
  },
  JBSingleTokenPaymentTerminalStore: {
    addresses: {
      [NetworkName.sepolia]: '0x981c8ECD009E3E84eE1fF99266BF1461a12e5c68',
    },
  },
  JBETHPaymentTerminal: {
    addresses: {
      [NetworkName.sepolia]: '0x55FF1D8093166c1fF9664efd613D8C543b95feFc',
    },
  },
}

/**
 * Note: the v2 contracts npm package doesn't contain the goerli deployment.
 * So, we just assume mainnet abi's are the same on goerli and mainnet, and import
 * the mainnet ones.
 *
 */
export const loadJuiceboxV2Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> => {
  const contractOverride = V2_CONTRACT_ABI_OVERRIDES[contractName]

  try {
    let contractJson: ContractJson | undefined
    switch (contractName) {
      case V2V3ContractName.JBController: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBController.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBDirectory: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBDirectory.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBETHPaymentTerminal.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBFundingCycleStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBFundingCycleStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBOperatorStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBOperatorStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBProjects: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBProjects.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSplitsStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBSplitsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBTokenStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBTokenStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSingleTokenPaymentTerminalStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHERC20ProjectPayerDeployer: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBETHERC20ProjectPayerDeployer.json`
        )) as ContractJson
        break
      }
    }

    if (!contractJson) return

    const address =
      contractOverride?.addresses?.[network] ?? contractJson.address

    return {
      ...contractJson,
      address,
    }
  } catch (e) {
    return undefined
  }
}
