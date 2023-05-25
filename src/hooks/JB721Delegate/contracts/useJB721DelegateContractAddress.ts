import { readNetwork } from 'constants/networks'
import { ForgeDeploy } from 'models/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useEffect, useState } from 'react'

async function loadJB721DelegateDeployment(version: JB721DelegateVersion) {
  return (await import(
    `@jbx-protocol/juice-721-delegate-v${version}/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy
}

export async function loadJB721DelegateAddress(
  contractName: string,
  version: JB721DelegateVersion,
) {
  const deployment = await loadJB721DelegateDeployment(version)

  const address = deployment?.transactions.find(
    tx => tx.contractName === contractName,
  )?.contractAddress

  return address!
}

export function useJB721DelegateContractAddress({
  contractName,
  version,
}: {
  contractName: string
  version: JB721DelegateVersion | undefined
}): string | undefined {
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      if (!version) return

      const address = await loadJB721DelegateAddress(contractName, version)

      setAddress(address)
    }

    load()
  }, [contractName, version])

  return address
}
