import { BigNumber } from 'ethers'
import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import useContractReader from 'hooks/v2v3/contractReader/useV2ContractReader'

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
