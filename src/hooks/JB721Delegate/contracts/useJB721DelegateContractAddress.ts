import { readNetwork } from 'constants/networks'
import { ForgeDeploy } from 'models/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useEffect, useState } from 'react'

async function loadJB721DelegateDeployment(version: JB721DelegateVersion) {
  return (await import(
    `@jbx-protocol/juice-721-delegate-v${version}/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy
}

export function useJB721DelegateContractAddress({
  contractName,
  version,
}: {
  contractName: string
  version: JB721DelegateVersion | undefined
}): string | undefined {
  const [deployment, setDeployment] = useState<ForgeDeploy | undefined>(
    undefined,
  )
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      if (!version) return

      if (!deployment) {
        const d = await loadJB721DelegateDeployment(version)
        setDeployment(d)
        return
      }

      const addr = deployment?.transactions.find(
        tx => tx.contractName === contractName,
      )?.contractAddress

      setAddress(addr)
    }

    load()
  }, [deployment, contractName, version])

  return address
}
