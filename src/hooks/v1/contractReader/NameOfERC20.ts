import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from './ContractReader'

/** Returns name for ERC20 token with `address`. */
export default function useNameOfERC20(address: string | undefined) {
  return useContractReader<string>({
    contract: useErc20Contract(address),
    functionName: 'name',
  })
}
