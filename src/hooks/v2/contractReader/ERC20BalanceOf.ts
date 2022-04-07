import { BigNumber } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns ERC20 balance of `wallet`. Pass arguments for `projectId` and `terminalName` if the ERC20 is a project token, to update the returned value when relevant on-chain events are emitted. */
export default function useERC20BalanceOf(
  tokenAddress: string | undefined,
  walletAddress: string | undefined,
) {
  return useContractReader<BigNumber>({
    contract: useErc20Contract(tokenAddress),
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : null,
    valueDidChange: bigNumbersDiff,
    // TODO: implement updateOn arg (useShouldUpdateTokens -> update on pay, redeem, mint or convert)
  })
}
