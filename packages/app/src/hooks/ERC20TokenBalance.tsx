import { BigNumber } from '@ethersproject/bignumber'

import useContractReader from './ContractReader'
import { useErc20Contract } from './Erc20Contract'

export function useERC20TokenBalance(
  walletAddress: string | undefined,
  tokenAddress: string | undefined,
) {
  const contract = useErc20Contract(tokenAddress)

  return useContractReader<BigNumber>({
    contract,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : null,
  })
}
