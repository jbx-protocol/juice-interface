import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'models/v2v3/contracts'

/**
 *  Defines the ABI filename to use for a given V2V3ContractName.
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
}

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
          `@jbx-protocol/contracts-v2-4.0.0/deployments/${network}/JBDirectory.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.DeprecatedJBSplitsStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-4.0.0/deployments/${network}/JBSplitsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBController: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBController.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBDirectory: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBDirectory.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBETHPaymentTerminal.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBFundingCycleStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBFundingCycleStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBFundAccessConstraintsStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBFundAccessConstraintsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBOperatorStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBOperatorStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBProjects: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBProjects.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSplitsStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBSplitsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBTokenStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBTokenStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSingleTokenPaymentTerminalStore: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBSingleTokenPaymentTerminalStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHERC20ProjectPayerDeployer: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBETHERC20ProjectPayerDeployer.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHERC20SplitsPayerDeployer: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBETHERC20SplitsPayerDeployer.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBPrices: {
        contractJson = (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${network}/JBPrices.json`
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
