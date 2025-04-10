import { readNetwork } from 'constants/networks'
import { ForgeDeploy, addressFor } from 'forge-run-parser'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

/**
 * Some addresses aren't in the forge deployment manifests, so we have to hardcode them here.
 */
const ADDRESSES: {
  [k in JB721DelegateVersion]?: {
    [k in NetworkName]?: {
      [k: string]: string
    }
  }
} = {
  [JB721DelegateVersion.JB721DELEGATE_V3_4]: {
    [NetworkName.sepolia]: {
      JBTiered721DelegateStore: '0xd7F9Ee12b5De2388109C9dD4fAAf39BEfe4C92FB', // the store from 3.3
      JBTiered721DelegateProjectDeployer:
        '0x70b59C0ad71b8e7c9B57328bEb7Ad5921b44dB81',
    },
    [NetworkName.mainnet]: {
      JBTiered721DelegateStore: '0x615B5b50F1Fc591AAAb54e633417640d6F2773Fd', // the store from 3.3
      JBTiered721DelegateProjectDeployer:
        '0xFbD1B7dE4082826Bf4BaA68D020eFA5c2707Fb3e',
    },
  },
}

async function loadJB721DelegateDeployment(version: JB721DelegateVersion) {
  return (await import(
    `@jbx-protocol/juice-721-delegate-v${version}/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy
}

export async function loadJB721DelegateAddress(
  contractName: string,
  version: JB721DelegateVersion,
) {
  const hardcodedAddress =
    ADDRESSES[version]?.[readNetwork.name]?.[contractName]
  if (hardcodedAddress) return hardcodedAddress

  const forgeGeployment = await loadJB721DelegateDeployment(version)
  const forgeAddress = addressFor(contractName, forgeGeployment)
  return forgeAddress!
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
