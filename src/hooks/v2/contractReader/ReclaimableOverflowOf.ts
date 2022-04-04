import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'
import { V2UserContext } from 'contexts/v2/userContext'

import useContractReader from './V2ContractReader'
import useTotalBalanceOf from './TotalBalanceOf'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useReclaimableOverflowOf() {
  const { terminals, projectId } = useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)
  const { contracts } = useContext(V2UserContext)

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)

  const _projectId = projectId
    ? BigNumber.from(projectId).toHexString()
    : undefined

  const primaryTerminal = terminals?.[0]

  return useContractReader<BigNumber>({
    contract: contracts?.JBPaymentTerminalStore,
    functionName: 'currentReclaimableOverflowOf',
    args:
      userAddress && _projectId
        ? [
            primaryTerminal,
            _projectId,
            totalBalance?.toHexString(),
            false, // _useTotalOverflow (just using 1 terminal for now)
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn for 'pay' and 'redeem'
  })
}
