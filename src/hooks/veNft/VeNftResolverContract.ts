import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

import { veNftResolverAbi } from 'constants/veNft/veNftResolverAbi'

export function useVeNftResolverContract(address: string | undefined) {
  return useLoadContractFromAddress({ address, abi: veNftResolverAbi })
}
