import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'
import useContractReader from './useContractReader'
import useTotalBalanceOf from './useTotalBalanceOf'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useClaimableOverflowOf() {
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()
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
