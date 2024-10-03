import { ONE_BILLION } from 'constants/numbers'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectReservedTokens } from 'packages/v2v3/hooks/contractReader/ProjectReservedTokens'
import {
  formatReservedRate,
  formatSplitPercent,
} from 'packages/v2v3/utils/math'
import { useMemo } from 'react'
import assert from 'utils/assert'
import { formatAmount } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'

const ONE_BILLION_BIG = BigNumber.from(ONE_BILLION)

export const useReservedTokensSubPanel = () => {
  const { projectId } = useProjectMetadataContext()
  const { fundingCycleMetadata, reservedTokensSplits, projectOwnerAddress } =
    useProjectContext()
  const reservedRateWad = fundingCycleMetadata?.reservedRate

  const { data: reservedTokensWad } = useProjectReservedTokens({
    projectId,
    reservedRate: reservedRateWad,
  })

  const reservedList = useMemo(() => {
    if (!projectOwnerAddress || !projectId || !reservedTokensSplits) return
    // If there aren't explicitly defined splits, all reserved tokens go to this project.
    if (reservedTokensSplits?.length === 0)
      return [
        {
          projectId: 0,
          address: projectOwnerAddress!,
          percent: `${formatSplitPercent(ONE_BILLION_BIG)}%`,
        },
      ]

    // If the splits don't add up to 100%, remaining tokens go to this project.
    let splitsPercentTotal = BigNumber.from(0)
    const processedSplits = reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        const splitPercent = BigNumber.from(split.percent)
        splitsPercentTotal = splitsPercentTotal.add(splitPercent)

        return {
          projectId: split.projectId
            ? BigNumber.from(split.projectId).toNumber()
            : undefined,
          address: split.beneficiary!,
          percent: `${formatSplitPercent(splitPercent)}%`,
        }
      })

    const remainingPercentage = ONE_BILLION_BIG.sub(splitsPercentTotal)

    // Check if this project is already one of the splits.
    if (!remainingPercentage.isZero()) {
      const projectSplitIndex = processedSplits.findIndex(
        v => v.projectId === projectId,
      )
      if (projectSplitIndex != -1)
        // If it is, increase its split percentage to bring the total to 100%.
        processedSplits[projectSplitIndex].percent = `${formatSplitPercent(
          remainingPercentage.add(
            reservedTokensSplits[projectSplitIndex].percent,
          ),
        )}%`
      // If it isn't, add a split at the beginning which brings the total percentage to 100%.
      else
        processedSplits.unshift({
          projectId: 0,
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
