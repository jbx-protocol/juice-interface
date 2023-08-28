import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { useJB721DelegateAbi } from './useJB721DelegateAbi'

export function useJB721TieredDelegateStore({
  address,
  version,
}: {
  address: string | undefined
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JB721DelegateStoreJson = useJB721DelegateAbi(
    'IJBTiered721DelegateStore',
    version,
  )
  return useLoadContractFromAddress({
    address,
    abi: JB721DelegateStoreJson,
  })
}
