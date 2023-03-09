import { Contract } from '@ethersproject/contracts'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useJB721DelegateAbi } from './JB721DelegateAbi'

export function useJB721TieredDelegateStore({
  address,
  version,
}: {
  address: string | undefined
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JB721DelegateStoreJson = useJB721DelegateAbi(
    '/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore',
    version,
  )
  return useLoadContractFromAddress({
    address,
    abi: JB721DelegateStoreJson,
  })
}
