import { Contract } from '@ethersproject/contracts'
import JBV3TokenDeployerJson from '@jbx-protocol/juice-v3-migration/out/DeployJBV3TokenDeployer.sol/Deploy_JB_V3_Token_Deployer_On_Mainnet.json'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { useEffect, useState } from 'react'
import { ForgeDeploy } from 'utils/v2v3/loadV2V3Contract'

async function loadJbV3MigrationDeployment() {
  const deployment = (await import(
    `@jbx-protocol/juice-v3-migration/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
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
