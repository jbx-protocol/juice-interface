import { BigNumber } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import useContractReader from 'packages/v2v3/hooks/contractReader/useV2ContractReader'
import { bigNumbersDiff } from 'utils/bigNumbers'

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
  })
}
