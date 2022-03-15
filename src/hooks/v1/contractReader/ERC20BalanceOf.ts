import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { V1TerminalName } from 'models/v1/terminals'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns ERC20 balance of `wallet`. Pass arguments for `projectId` and `terminalName` if the ERC20 is a project token, to update the returned value when relevant on-chain events are emitted. */
export default function useERC20BalanceOf(
  tokenAddress: string | undefined,
  wallet: string | undefined,
  projectId?: BigNumberish,
  terminalName?: V1TerminalName,
) {
  return useContractReader<BigNumber>({
    contract: useErc20Contract(tokenAddress),
    functionName: 'balanceOf',
    args: wallet ? [wallet] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, wallet),
  })
}
