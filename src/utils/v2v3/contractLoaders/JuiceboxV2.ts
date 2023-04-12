import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'models/v2v3/contracts'

/**
 * Defines the ABI filename to use for a given V2V3ContractName.
 *
 * Goerli addresses courtesy of ser drgorilla.eth
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
      [NetworkName.goerli]: '0x99dB6b517683237dE9C494bbd17861f3608F3585',
    },
  },
  JBProjects: {
    addresses: {
      [NetworkName.goerli]: '0x21263a042aFE4bAE34F08Bb318056C181bD96D3b',
    },
  },
  JBDirectory: {
    addresses: {
      [NetworkName.goerli]: '0xeFA8232c90EB523AA4eAe5C0CA2Dd63b5bDC91a1',
    },
  },
  JBFundingCycleStore: {
    addresses: {
      [NetworkName.goerli]: '0xa0FbC1c00C6d9F9d0DD344245E05F7618530A748',
    },
  },
  JBTokenStore: {
    addresses: {
      [NetworkName.goerli]: '0x03104e05412729B98151875Fd83d20A95334E5b1',
    },
  },
  JBSplitsStore: {
    addresses: {
      [NetworkName.goerli]: '0x2293Dbbd37a2CC6bdba109429b91d8398b2CC11f',
    },
  },
  JBController: {
    addresses: {
      [NetworkName.goerli]: '0xE270E62137ceB784FCb1f47Ad7cA0Ba84Cc19d92',
    },
  },
  JBSingleTokenPaymentTerminalStore: {
    addresses: {
      [NetworkName.goerli]: '0x27c4640aF8d1B24f1353C5d112a30fCed19b4978',
    },
  },
  JBETHPaymentTerminal: {
    addresses: {
      [NetworkName.goerli]: '0x8E8d0C73ddee3819Aaa1A2943350012803Cb8AcE',
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
      case V2V3ContractName.DeprecatedJBDirectory: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-4.0.0/deployments/mainnet/JBDirectory.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.DeprecatedJBSplitsStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-4.0.0/deployments/mainnet/JBSplitsStore.json`
        )) as ContractJson
        break
      }
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
      case V2V3ContractName.JBETHERC20SplitsPayerDeployer: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBETHERC20SplitsPayerDeployer.json`
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
