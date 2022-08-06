import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

import { veNftAbi } from 'constants/veNft/veNftAbi'

export function useVeNftContract(address: string | undefined) {
  return useLoadContractFromAddress({ address, abi: veNftAbi })
}
