import { useEffect, useState } from 'react'

import { ContractInterface } from 'ethers'
import { ContractJson } from 'models/contracts'
import { JB721DelegateVersion } from 'models/JB721Delegate'

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
      ? await import('./interfaceAbis/juice-721-delegate-interfaces-v3')
      : version === '3-1'
      ? await import('./interfaceAbis/juice-721-delegate-interfaces-v3-1')
      : version === '3-2'
      ? await import('./interfaceAbis/juice-721-delegate-interfaces-v3-2')
      : version === '3-3'
      ? await import('./interfaceAbis/juice-721-delegate-interfaces-v3-3')
      : version === '3-4'
      ? await import('./interfaceAbis/juice-721-delegate-interfaces-v3-4')
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
