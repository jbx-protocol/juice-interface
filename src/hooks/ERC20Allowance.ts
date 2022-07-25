import { BigNumber } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from 'hooks/v2/contractReader/V2ContractReader'

export default function useERC20Allowance(
  tokenAddress: string | undefined,
  owner: string | undefined,
  spender: string | undefined,
) {
  return useContractReader<BigNumber>({
    contract: useErc20Contract(tokenAddress),
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : null,
  })
}
