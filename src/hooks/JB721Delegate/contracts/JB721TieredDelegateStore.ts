import { Contract } from '@ethersproject/contracts'
import JB721DelegateStoreJson from '@jbx-protocol/juice-721-delegate-v1/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

export function useJB721TieredDelegateStore({
  address,
}: {
  address: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address,
    abi: JB721DelegateStoreJson.abi,
  })
}
