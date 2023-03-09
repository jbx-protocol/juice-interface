import { CV_V2, CV_V3 } from 'constants/cv'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'
import { loadJuiceboxV2Contract } from './JuiceboxV2'
import { loadJuiceboxV3Contract } from './JuiceboxV3'

export async function loadJuiceboxV2OrV3Contract(
  cv: CV2V3,
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> {
  return cv === CV_V2
    ? await loadJuiceboxV2Contract(contractName, network)
    : cv === CV_V3
    ? await loadJuiceboxV3Contract(contractName, network)
    : undefined
}
