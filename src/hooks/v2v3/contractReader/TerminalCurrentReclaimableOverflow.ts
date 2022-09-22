import { BigNumber } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2V3ContractName } from 'models/v2v3/contracts'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useTotalBalanceOf from './TotalBalanceOf'
import useV2ContractReader from './V2ContractReader'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useTerminalCurrentReclaimableOverflow({
  terminal,
}: {
  terminal: string | undefined
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { userAddress } = useWallet()

  const { data: totalBalance, loading: totalBalanceLoading } =
    useTotalBalanceOf(userAddress, projectId)

  return useV2ContractReader<BigNumber>({
    contract: V2V3ContractName.JBSingleTokenPaymentTerminalStore,
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
