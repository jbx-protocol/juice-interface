import { useLoadContractFromAddress } from '../useLoadContractFromAddress'
import erc20Abi from './erc20Abi'

export function useErc20Contract(address: string | undefined) {
  return useLoadContractFromAddress({ address, abi: erc20Abi })
}
