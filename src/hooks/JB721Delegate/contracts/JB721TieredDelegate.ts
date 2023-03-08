import { Contract } from '@ethersproject/contracts'
import JB721TieredDelegateJson from '@jbx-protocol/juice-721-delegate/out/IJBTiered721Delegate.sol/IJBTiered721Delegate.json'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

export function useJB721TieredDelegate({
  address,
}: {
  address: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address,
    abi: JB721TieredDelegateJson.abi,
  })
}
