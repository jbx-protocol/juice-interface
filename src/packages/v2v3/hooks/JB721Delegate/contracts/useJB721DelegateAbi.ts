import { ContractInterface } from 'ethers'
import { ContractJson } from 'models/contracts'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { useEffect, useState } from 'react'
import * as v3 from './interfaceAbis/juice-721-delegate-interfaces-v3'
import * as v3_1 from './interfaceAbis/juice-721-delegate-interfaces-v3-1'
import * as v3_2 from './interfaceAbis/juice-721-delegate-interfaces-v3-2'
import * as v3_3 from './interfaceAbis/juice-721-delegate-interfaces-v3-3'
import * as v3_4 from './interfaceAbis/juice-721-delegate-interfaces-v3-4'

type JB721DelegateContractName =
  | 'JB721TieredGovernance'
  | 'IJBTiered721DelegateStore'
  | 'IJBTiered721Delegate'
  | 'IJBTiered721DelegateProjectDeployer'

export async function loadJB721DelegateJson(
  contractName: JB721DelegateContractName,
  version: JB721DelegateVersion,
): Promise<ContractJson | undefined> {
  console.info('Loading JB721Delegate contract json', version, contractName)

  const contractSet =
    version === '3'
      ? v3
      : version === '3-1'
      ? v3_1
      : version === '3-2'
      ? v3_2
      : version === '3-3'
      ? v3_3
      : version === '3-4'
      ? v3_4
      : undefined

  return contractSet?.[contractName]
}

export function useJB721DelegateAbi(
  contractName: JB721DelegateContractName,
  version: JB721DelegateVersion | undefined,
) {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)

  useEffect(() => {
    if (!version) return

    loadJB721DelegateJson(contractName, version).then(json => setAbi(json?.abi))
  }, [version, contractName])

  return abi
}
