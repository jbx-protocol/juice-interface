import { Contract, ContractInterface } from '@ethersproject/contracts'
import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V2CVType, V3CVType } from 'models/cv'
import { NetworkName } from 'models/network-name'
import { SignerOrProvider } from 'models/signerOrProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { featureFlagEnabled } from 'utils/featureFlags'
import { loadJBProjectHandlesContract } from './contractLoaders/JBProjectHandles'
import { loadJBTiered721DelegateProjectDeployerContract } from './contractLoaders/JBTiered721DelegateProjectDeployer'
import { loadJBTiered721DelegateStoreContract } from './contractLoaders/JBTiered721DelegateStore'
import { loadJuiceboxV2Contract } from './contractLoaders/JuiceboxV2'
import { loadJuiceboxV3Contract } from './contractLoaders/JuiceboxV3'
import { loadPublicResolverContract } from './contractLoaders/PublicResolver'
import { loadJBV1TokenPaymentTerminalContract } from './contractLoaders/V1TokenPaymentTerminal'
import { loadVeNftDeployer } from './contractLoaders/VeNftDeployer'
import { loadVeTokenUriResolver } from './contractLoaders/VeTokenUriResolver'

export interface ForgeDeploy {
  receipts: { contractAddress: string }[]
}

export const loadV2V3Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
  version: V2CVType | V3CVType,
): Promise<Contract | undefined> => {
  let contractJson: { abi: ContractInterface; address: string } | undefined =
    undefined

  if (contractName === V2V3ContractName.JBProjectHandles) {
    contractJson = await loadJBProjectHandlesContract(network)
  } else if (contractName === V2V3ContractName.PublicResolver) {
    contractJson = loadPublicResolverContract(network)
  } else if (
    contractName === V2V3ContractName.JBV1TokenPaymentTerminal &&
    featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
  ) {
    contractJson = await loadJBV1TokenPaymentTerminalContract(network)
  } else if (
    contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer &&
    featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)
  ) {
    contractJson = await loadJBTiered721DelegateProjectDeployerContract()
  } else if (
    contractName === V2V3ContractName.JBTiered721DelegateStore &&
    featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)
  ) {
    contractJson = await loadJBTiered721DelegateStoreContract()
  } else if (
    contractName === V2V3ContractName.JBVeNftDeployer &&
    featureFlagEnabled(FEATURE_FLAGS.VENFT)
  ) {
    contractJson = await loadVeNftDeployer()
  } else if (
    contractName === V2V3ContractName.JBVeTokenUriResolver &&
    featureFlagEnabled(FEATURE_FLAGS.VENFT)
  ) {
    contractJson = await loadVeTokenUriResolver()
  } else {
    contractJson =
      version === CV_V2
        ? await loadJuiceboxV2Contract(contractName, network)
        : version === CV_V3
        ? await loadJuiceboxV3Contract(contractName, network)
        : undefined
  }

  if (!contractJson) {
    console.info(
      `Contract load skipped [contract=${contractName} network=${network}, version=${version}]`,
    )
    return
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
