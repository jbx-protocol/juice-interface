import { BigNumber } from 'ethers'
import { useV1TotalBalance } from './useV1TokenBalance'
import { useV1UnclaimedBalanceForV3Token } from './useV1UnclaimedBalanceForV3Token'
import { useV2TotalBalance } from './useV2TokenBalance'
import { useV2UnclaimedBalanceForV3Token } from './useV2UnclaimedBalanceForV3Token'

export function useTotalLegacyTokenBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const v1TotalBalance = useV1TotalBalance()
  const v1UnclaimedBalance = useV1UnclaimedBalanceForV3Token()
  const v1ClaimedBalance = v1TotalBalance?.sub(v1UnclaimedBalance)

  const { data: v2TotalBalance } = useV2TotalBalance({ projectId })
  const { data: v2UnclaimedBalance } = useV2UnclaimedBalanceForV3Token({
    projectId,
  })

  const totalLegacyTokenBalance = v1TotalBalance?.add(v2TotalBalance ?? 0)

  const v2ClaimedBalance =
    v2TotalBalance?.sub(v2UnclaimedBalance ?? 0) ?? BigNumber.from(0)

  return {
    v1TotalBalance,
    v1UnclaimedBalance,
    v1ClaimedBalance,

    v2TotalBalance,
    v2UnclaimedBalance,
    v2ClaimedBalance,

    totalLegacyTokenBalance,
  }
}
