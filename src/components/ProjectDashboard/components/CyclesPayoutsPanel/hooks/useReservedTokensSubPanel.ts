import assert from 'assert'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useMemo } from 'react'
import { formatAmount } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { formatReservedRate, formatSplitPercent } from 'utils/v2v3/math'

export const useReservedTokensSubPanel = () => {
  const { projectId } = useProjectMetadata()
  const { fundingCycleMetadata, reservedTokensSplits } = useProjectContext()
  const reservedRateWad = fundingCycleMetadata?.reservedRate

  const { data: reservedTokensWad } = useProjectReservedTokens({
    projectId,
    reservedRate: reservedRateWad,
  })

  const reservedList = useMemo(() => {
    if (!reservedTokensSplits) return undefined
    return reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        return {
          projectId: split.projectId
            ? BigNumber.from(split.projectId).toNumber()
            : undefined,
          address: split.beneficiary!,
          percent: `${formatSplitPercent(BigNumber.from(split.percent))}%`,
        }
      })
  }, [reservedTokensSplits])

  const reservedRate = useMemo(() => {
    if (!reservedRateWad) return undefined
    return `${formatReservedRate(reservedRateWad)}%`
  }, [reservedRateWad])

  const reservedTokens = useMemo(() => {
    if (!reservedTokensWad) return undefined
    return formatAmount(fromWad(reservedTokensWad))
  }, [reservedTokensWad])

  return { reservedList, reservedTokens, reservedRate }
}
