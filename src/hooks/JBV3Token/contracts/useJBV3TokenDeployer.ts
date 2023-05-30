import JBV3TokenDeployerJson from '@jbx-protocol/juice-v3-migration/out/JBV3TokenDeployer.sol/JBV3TokenDeployer.json'
import { readNetwork } from 'constants/networks'
import { Contract } from 'ethers'
import { ForgeDeploy, addressFor } from 'forge-run-parser'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { useEffect, useState } from 'react'

async function loadJbV3MigrationDeployment() {
  const deployment = (await import(
    `@jbx-protocol/juice-v3-migration/broadcast/DeployJBV3TokenDeployer.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy

  return deployment
}

export function useJBV3TokenDeployer(): Contract | undefined {
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadJbV3MigrationDeployment().then(deployment => {
      const address = addressFor('JBV3TokenDeployer', deployment)

      setAddress(address)
    })
  }, [])

  return useLoadContractFromAddress({
    address,
    abi: JBV3TokenDeployerJson.abi,
  })
}
