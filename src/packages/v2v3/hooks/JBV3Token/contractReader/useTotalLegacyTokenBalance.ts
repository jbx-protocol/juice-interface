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
  const v1ClaimedBalance = v1TotalBalance
    ? v1TotalBalance - v1UnclaimedBalance
    : undefined

  const { data: v2TotalBalance } = useV2TotalBalance({ projectId })
  const { data: v2UnclaimedBalance } = useV2UnclaimedBalanceForV3Token({
    projectId,
  })

  const totalLegacyTokenBalance = v1TotalBalance
    ? v1TotalBalance + (v2TotalBalance ?? 0n)
    : undefined

  const v2ClaimedBalance = v2TotalBalance
    ? v2TotalBalance - (v2UnclaimedBalance ?? 0n)
    : BigInt(0)

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
