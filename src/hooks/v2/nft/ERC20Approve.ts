import { BigNumber } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/Erc20Contract'

import useContractReader from 'hooks/v2/contractReader/V2ContractReader'

export default function useERC20Approve(
  tokenAddress: string | undefined,
  wallet: string,
  value: BigNumber,
) {
  return useContractReader<BigNumber>({
    contract: useErc20Contract(tokenAddress),
    functionName: 'approve',
    args: [wallet, value],
  })
}
