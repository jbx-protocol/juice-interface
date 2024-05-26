import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'models/v2v3/contracts'

export const loadJuiceboxV3Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> => {
  try {
    let contractJson: ContractJson | undefined
    switch (contractName) {
      case V2V3ContractName.JBController: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBController.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBController3_1: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBController3_1.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBDirectory: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBDirectory.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBETHPaymentTerminal.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal3_1: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBETHPaymentTerminal3_1.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal3_1_1: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBETHPaymentTerminal3_1_1.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHPaymentTerminal3_1_2: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBETHPaymentTerminal3_1_2.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBFundingCycleStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBFundingCycleStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBFundAccessConstraintsStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBFundAccessConstraintsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBOperatorStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBOperatorStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBProjects: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBProjects.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSplitsStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBSplitsStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBTokenStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBTokenStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSingleTokenPaymentTerminalStore: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBSingleTokenPaymentTerminalStore.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSingleTokenPaymentTerminalStore3_1: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBSingleTokenPaymentTerminalStore3_1.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBSingleTokenPaymentTerminalStore3_1_1: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBSingleTokenPaymentTerminalStore3_1_1.json`
        )) as ContractJson
        break
      }
      case V2V3ContractName.JBETHERC20ProjectPayerDeployer: {
        contractJson = (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${network}/JBETHERC20ProjectPayerDeployer.json`
        )) as ContractJson
        break
      }
    }

    return contractJson
  } catch (_) {
    return undefined
  }
}
