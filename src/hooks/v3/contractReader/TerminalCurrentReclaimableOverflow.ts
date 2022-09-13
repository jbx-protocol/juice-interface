import { BigNumber } from '@ethersproject/bignumber'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V3ContractName } from 'models/v3/contracts'

import useTotalBalanceOf from './TotalBalanceOf'
import useV3ContractReader from './V3ContractReader'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useTerminalCurrentReclaimableOverflow({
  terminal,
}: {
  terminal: string | undefined
}) {
  const { projectId } = useContext(V3ProjectContext)
  const { userAddress } = useWallet()

  const { data: totalBalance, loading: totalBalanceLoading } =
    useTotalBalanceOf(userAddress, projectId)

  return useV3ContractReader<BigNumber>({
    contract: V3ContractName.JBSingleTokenPaymentTerminalStore,
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
