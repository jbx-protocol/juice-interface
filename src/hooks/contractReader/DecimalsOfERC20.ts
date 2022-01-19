import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from './ContractReader'

/** Returns decimals used by ERC20 with `address`. */
export default function useDecimalsOfERC20(address: string | undefined) {
  return useContractReader<number>({
    contract: useErc20Contract(address),
    functionName: 'decimals',
  })
}
