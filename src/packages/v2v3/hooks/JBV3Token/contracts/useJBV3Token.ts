import { Contract } from 'ethers'
import { abi } from './JBV3TokenAbi'

import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'

export function useJBV3Token({
  tokenAddress,
}: {
  tokenAddress: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address: tokenAddress,
    abi,
  })
}
