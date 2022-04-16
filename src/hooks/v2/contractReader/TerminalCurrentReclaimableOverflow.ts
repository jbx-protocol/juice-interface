import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'
import useTotalBalanceOf from './TotalBalanceOf'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useTerminalCurrentReclaimableOverflow({
  terminal,
}: {
  terminal: string | undefined
}) {
  const { projectId } = useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const { data: totalBalance, loading: totalBalanceLoading } =
    useTotalBalanceOf(userAddress, projectId)

  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBPaymentTerminalStore,
    functionName: 'currentReclaimableOverflowOf',
    args:
      !totalBalanceLoading &&
      totalBalance !== undefined &&
      terminal &&
      projectId
        ? [
            terminal,
            projectId,
            totalBalance,
            false, // _useTotalOverflow (just using 1 terminal for now)
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn for 'pay' and 'redeem'
  })
}
