import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from './v1/contractReader/ContractReader'

/** Returns symbol for ERC20 token with `address`. */
export default function useSymbolOfERC20(address: string | undefined) {
  return useContractReader<string>({
    contract: useErc20Contract(address),
    functionName: 'symbol',
  })
}
