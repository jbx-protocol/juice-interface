import { Contract, ContractInterface } from '@ethersproject/contracts'
import { V2V3CVType } from 'models/cv'
import { NetworkName } from 'models/network-name'
import { SignerOrProvider } from 'models/signerOrProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { loadJBProjectHandlesContract } from './contractLoaders/JBProjectHandles'
import { loadJBTiered721DelegateProjectDeployerContract } from './contractLoaders/JBTiered721DelegateProjectDeployer'
import { loadJBTiered721DelegateStoreContract } from './contractLoaders/JBTiered721DelegateStore'
import { loadJuiceboxV2OrV3Contract } from './contractLoaders/JuiceboxV2OrV3'
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
  version: V2V3CVType,
): Promise<Contract | undefined> => {
  let contractJson: { abi: ContractInterface; address: string } | undefined =
    undefined

  if (contractName === V2V3ContractName.JBProjectHandles) {
    contractJson = await loadJBProjectHandlesContract(network)
  } else if (contractName === V2V3ContractName.PublicResolver) {
    contractJson = loadPublicResolverContract(network)
  } else if (contractName === V2V3ContractName.JBV1TokenPaymentTerminal) {
    contractJson = await loadJBV1TokenPaymentTerminalContract(network)
  } else if (
    contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer
  ) {
    contractJson = await loadJBTiered721DelegateProjectDeployerContract()
  } else if (contractName === V2V3ContractName.JBTiered721DelegateStore) {
    contractJson = await loadJBTiered721DelegateStoreContract()
  } else if (contractName === V2V3ContractName.JBVeNftDeployer) {
    contractJson = await loadVeNftDeployer()
  } else if (contractName === V2V3ContractName.JBVeTokenUriResolver) {
    contractJson = await loadVeTokenUriResolver()
  } else {
    contractJson = await loadJuiceboxV2OrV3Contract(
      version,
      contractName,
      network,
    )
  }

  if (!contractJson) {
    console.info(
      `Contract load skipped [contract=${contractName} network=${network}, version=${version}]`,
    )
    return
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
