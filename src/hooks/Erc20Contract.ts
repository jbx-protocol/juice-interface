import erc20Abi from 'erc-20-abi'

import { useLoadContractFromAddress } from './LoadContractFromAddress'

export function useErc20Contract(address: string | undefined) {
  return useLoadContractFromAddress({ address, abi: erc20Abi })
}
