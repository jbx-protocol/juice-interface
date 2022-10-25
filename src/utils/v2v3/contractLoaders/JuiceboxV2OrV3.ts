import { CV_V2, CV_V3 } from 'constants/cv'
import { CV } from 'models/cv'
import { NetworkName } from 'models/network-name'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { ContractJson } from '../loadV2V3Contract'
import { loadJuiceboxV2Contract } from './JuiceboxV2'
import { loadJuiceboxV3Contract } from './JuiceboxV3'

export async function loadJuiceboxV2OrV3Contract(
  cv: CV,
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> {
  return cv === CV_V2
    ? await loadJuiceboxV2Contract(contractName, network)
    : cv === CV_V3
    ? await loadJuiceboxV3Contract(contractName, network)
    : undefined
}
