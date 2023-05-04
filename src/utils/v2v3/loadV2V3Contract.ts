import { Contract } from 'ethers'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { SignerOrProvider } from 'models/signerOrProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'
import { loadJuiceboxV2OrV3Contract } from './contractLoaders/JuiceboxV2OrV3'

export const loadV2V3Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
  version: CV2V3,
): Promise<Contract | undefined> => {
  const contractJson: ContractJson | undefined =
    await loadJuiceboxV2OrV3Contract(version, contractName, network)

  if (!contractJson || !contractJson.address || !contractJson.abi) {
    console.info(
      `Contract load skipped [contract=${contractName} network=${network}, version=${version}]`,
    )
    return
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
