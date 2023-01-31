import { Contract, ContractInterface } from '@ethersproject/contracts'
import { NetworkName } from 'models/network-name'
import { SignerOrProvider } from 'models/signerOrProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'
import { loadJBProjectHandlesContract } from './contractLoaders/JBProjectHandles'
import { loadJBTiered721DelegateProjectDeployerContract } from './contractLoaders/JBTiered721DelegateProjectDeployer'
import { loadJuiceboxV2OrV3Contract } from './contractLoaders/JuiceboxV2OrV3'
import { loadPublicResolverContract } from './contractLoaders/PublicResolver'
import { loadVeNftDeployer } from './contractLoaders/VeNftDeployer'
import { loadVeTokenUriResolver } from './contractLoaders/VeTokenUriResolver'

export interface ForgeDeploy {
  receipts: { contractAddress: string }[]
  transactions: { contractName: string; contractAddress: string }[]
}

export interface ContractJson {
  address: string | undefined
  abi: ContractInterface | undefined
}

export const loadV2V3Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
  version: CV2V3,
): Promise<Contract | undefined> => {
  let contractJson: ContractJson | undefined = undefined

  if (contractName === V2V3ContractName.JBProjectHandles) {
    contractJson = await loadJBProjectHandlesContract(network)
  } else if (contractName === V2V3ContractName.PublicResolver) {
    contractJson = loadPublicResolverContract(network)
  } else if (
    contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer
  ) {
    contractJson = await loadJBTiered721DelegateProjectDeployerContract()
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

  if (!contractJson || !contractJson.address || !contractJson.abi) {
    console.info(
      `Contract load skipped [contract=${contractName} network=${network}, version=${version}]`,
    )
    return
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
