import { NetworkName } from 'models/network-name'
import { V2V3ContractName } from 'models/v2v3/contracts'

/**
 *  Defines the ABI filename to use for a given V2V3ContractName.
 */
const V2_CONTRACT_ABI_OVERRIDES: {
  [k in V2V3ContractName]?: { filename: string; version: string }
} = {
  DeprecatedJBSplitsStore: {
    version: '4.0.0',
    filename: 'JBSplitsStore',
  },
  DeprecatedJBDirectory: {
    version: '4.0.0',
    filename: 'JBDirectory',
  },
}

export const loadJuiceboxV2Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
) => {
  const contractOverride = V2_CONTRACT_ABI_OVERRIDES[contractName]
  const version = contractOverride?.version ?? 'latest'
  const filename = contractOverride?.filename ?? contractName
  return await import(
    `@jbx-protocol/contracts-v2-${version}/deployments/${network}/${filename}.json`
  )
}
