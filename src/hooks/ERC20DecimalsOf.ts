import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from './v1/contractReader/ContractReader'

/** Returns decimals used by ERC20 with `address`. */
export default function useERC20DecimalsOf(address: string | undefined) {
  return useContractReader<number>({
    contract: useErc20Contract(address),
    functionName: 'decimals',
  })
}
