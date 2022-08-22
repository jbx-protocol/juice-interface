import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './ContractReader'
import useTotalBalanceOf from './TotalBalanceOf'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useClaimableOverflowOf() {
  const { terminal, projectId } = useContext(V1ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)
  const _projectId = projectId
    ? BigNumber.from(projectId).toHexString()
    : undefined

  return useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && _projectId && totalBalance
        ? [userAddress, _projectId, totalBalance]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        _projectId && userAddress
          ? [
              {
                contract: terminal?.name,
                eventName: 'Pay',
                topics: [[], _projectId, userAddress],
              },
              {
                contract: terminal?.name,
                eventName: 'Redeem',
                topics: [_projectId, userAddress],
              },
            ]
          : undefined,
      [_projectId, userAddress, terminal?.name],
    ),
  })
}
