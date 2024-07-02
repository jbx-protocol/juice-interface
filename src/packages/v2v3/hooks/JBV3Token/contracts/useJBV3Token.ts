import JBV3TokenJson from '@jbx-protocol/juice-v3-migration/out/JBV3Token.sol/JBV3Token.json'
import { Contract } from 'ethers'

import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'

export function useJBV3Token({
  tokenAddress,
}: {
  tokenAddress: string | undefined
}): Contract | undefined {
  return useLoadContractFromAddress({
    address: tokenAddress,
    abi: JBV3TokenJson.abi,
  })
}
