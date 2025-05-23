import { BigNumber } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import useContractReader from 'packages/v2v3/hooks/contractReader/useV2ContractReader'

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
