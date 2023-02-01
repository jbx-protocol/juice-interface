import { Contract } from '@ethersproject/contracts'
import JBV3TokenDeployerJson from '@jbx-protocol/juice-v3-migration/out/JBV3TokenDeployer.sol/JBV3TokenDeployer.json'

import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

export function useJBV3Token({
  tokenAddress,
}: {
  tokenAddress: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address: tokenAddress,
    abi: JBV3TokenDeployerJson.abi,
  })
}
