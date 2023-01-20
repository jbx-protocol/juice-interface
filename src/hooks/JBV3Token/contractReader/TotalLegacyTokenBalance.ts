import { useV1TokenBalance } from './V1TokenBalance'
import { useV2TokenBalance } from './V2TokenBalance'

export function useTotalLegacyTokenBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const v1TokenBalance = useV1TokenBalance()
  const v2TokenBalance = useV2TokenBalance({ projectId })

  return v1TokenBalance?.add(v2TokenBalance)
}
