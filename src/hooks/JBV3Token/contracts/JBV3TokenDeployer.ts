import { Contract } from '@ethersproject/contracts'
import JBV3TokenDeployerJson from '@jbx-protocol/juice-v3-migration/out/JBV3TokenDeployer.sol/JBV3TokenDeployer.json'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { ForgeDeploy } from 'models/contracts'
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
    loadJbV3MigrationDeployment().then(deployments => {
      const address = deployments.transactions.find(
        tx => tx.contractName === 'JBV3TokenDeployer',
      )?.contractAddress

      setAddress(address)
    })
  }, [])

  return useLoadContractFromAddress({
    address,
    abi: JBV3TokenDeployerJson.abi,
  })
}
