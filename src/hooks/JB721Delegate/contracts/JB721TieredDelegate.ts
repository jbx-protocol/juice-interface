import { Contract } from '@ethersproject/contracts'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useJB721DelegateAbi } from './JB721DelegateAbi'

export function useJB721TieredDelegate({
  address,
  version,
}: {
  address: string | undefined
  version: JB721DelegateVersion | undefined
}): Contract | undefined {
  const JB721TieredDelegateJson = useJB721DelegateAbi(
    'out/IJBTiered721Delegate.sol/IJBTiered721Delegate.json',
    version,
  )
  return useLoadContractFromAddress({
    address,
    abi: JB721TieredDelegateJson,
  })
}
