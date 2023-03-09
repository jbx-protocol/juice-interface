import { Contract } from '@ethersproject/contracts'
import JB721TieredGovernanceJson from '@jbx-protocol/juice-721-delegate-v1/out/JB721TieredGovernance.sol/JB721TieredGovernance.json'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

export function useJB721TieredGovernance({
  address,
}: {
  address: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address,
    abi: JB721TieredGovernanceJson.abi,
  })
}
