import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useJB721DelegateAbi } from './JB721DelegateAbi'

export function useJB721TieredGovernance({
  address,
  version,
}: {
  address: string | undefined
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JB721TieredGovernanceJson = useJB721DelegateAbi(
    'JB721TieredGovernance',
    address ? version : undefined, // only load if address is given.
  )
  return useLoadContractFromAddress({
    address,
    abi: JB721TieredGovernanceJson,
  })
}
