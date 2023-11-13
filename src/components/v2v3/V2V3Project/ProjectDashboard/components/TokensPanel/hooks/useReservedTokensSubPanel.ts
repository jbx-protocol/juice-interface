import {
  useProjectContext,
  useProjectMetadata,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useMemo } from 'react'
import assert from 'utils/assert'
import { formatAmount } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { formatReservedRate, formatSplitPercent } from 'utils/v2v3/math'

const ONE_BILLION = BigNumber.from(1_000_000_000)

export const useReservedTokensSubPanel = () => {
  const { projectId } = useProjectMetadata()
  const { fundingCycleMetadata, reservedTokensSplits, projectOwnerAddress } =
    useProjectContext()
  const reservedRateWad = fundingCycleMetadata?.reservedRate

  const { data: reservedTokensWad } = useProjectReservedTokens({
    projectId,
    reservedRate: reservedRateWad,
  })

  const reservedList = useMemo(() => {
    if (!projectOwnerAddress || !projectId || !reservedTokensSplits) return
    if (reservedTokensSplits?.length === 0)
      return [
        {
          projectId,
          address: projectOwnerAddress!,
          percent: `${formatSplitPercent(ONE_BILLION)}%`,
        },
      ]

    let percentTotal = BigNumber.from(0)

    const processedSplits = reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        const splitPercent = BigNumber.from(split.percent)
        percentTotal = percentTotal.add(splitPercent)

        return {
          projectId: split.projectId
            ? BigNumber.from(split.projectId).toNumber()
            : undefined,
          address: split.beneficiary!,
          percent: `${formatSplitPercent(splitPercent)}%`,
        }
      })

    const remainingPercentage = ONE_BILLION.sub(percentTotal)

    if (!remainingPercentage.isZero()) {
      const foundIndex = processedSplits.findIndex(
        v => v.projectId === projectId,
      )
      if (foundIndex != -1)
        processedSplits[foundIndex].percent = `${formatSplitPercent(
          remainingPercentage.add(reservedTokensSplits[foundIndex].percent),
        )}%`
      else
        processedSplits.unshift({
          projectId,
          address: projectOwnerAddress!,
          percent: `${formatSplitPercent(remainingPercentage)}%`,
        })
    }

    return processedSplits
  }, [reservedTokensSplits, projectOwnerAddress, projectId])

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
