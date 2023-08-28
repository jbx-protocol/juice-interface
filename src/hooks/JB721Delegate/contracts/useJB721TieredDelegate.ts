import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { useJB721DelegateAbi } from './useJB721DelegateAbi'

export function useJB721TieredDelegate({
  address,
  version,
}: {
  address: string | undefined
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JB721TieredDelegateJson = useJB721DelegateAbi(
    'IJBTiered721Delegate',
    version,
  )
  return useLoadContractFromAddress({
    address,
    abi: JB721TieredDelegateJson,
  })
}
