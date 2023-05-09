import { BigNumber } from 'ethers'
import { useErc20Contract } from 'hooks/ERC20/useErc20Contract'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from '../v2v3/contractReader/useV2ContractReader'

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
