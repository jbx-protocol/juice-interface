import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { ONE_BILLION } from 'constants/numbers'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useMemo } from 'react'
import assert from 'utils/assert'
import { formatAmount } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { formatReservedRate, formatSplitPercent } from 'utils/v2v3/math'

const ONE_BILLION_BIG = BigInt(ONE_BILLION)

export const useReservedTokensSubPanel = () => {
  const { projectId } = useProjectMetadataContext()
  const { fundingCycleMetadata, reservedTokensSplits, projectOwnerAddress } =
    useProjectContext()
  const reservedRateWad = fundingCycleMetadata?.reservedRate

  const { data: reservedTokensWad, loading } = useProjectReservedTokens({
    projectId,
    reservedRate: reservedRateWad,
  })

  const reservedList = useMemo(() => {
    if (!projectOwnerAddress || !projectId || !reservedTokensSplits) return
    // If there aren't explicitly defined splits, all reserved tokens go to this project.
    if (reservedTokensSplits?.length === 0)
      return [
        {
          projectId,
          address: projectOwnerAddress!,
          percent: `${formatSplitPercent(ONE_BILLION_BIG)}%`,
        },
      ]

    // If the splits don't add up to 100%, remaining tokens go to this project.
    let splitsPercentTotal = BigInt(0)
    const processedSplits = reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        const splitPercent = BigInt(split.percent)
        splitsPercentTotal = splitsPercentTotal + splitPercent

        return {
          projectId: split.projectId
            ? Number(BigInt(split.projectId))
            : undefined,
          address: split.beneficiary!,
          percent: `${formatSplitPercent(splitPercent)}%`,
        }
      })

    const remainingPercentage = ONE_BILLION_BIG - splitsPercentTotal

    // Check if this project is already one of the splits.
    if (remainingPercentage !== 0n) {
      const projectSplitIndex = processedSplits.findIndex(
        v => v.projectId === projectId,
      )
      if (projectSplitIndex != -1)
        // If it is, increase its split percentage to bring the total to 100%.
        processedSplits[projectSplitIndex].percent = `${formatSplitPercent(
          remainingPercentage +
            BigInt(reservedTokensSplits[projectSplitIndex].percent),
        )}%`
      // If it isn't, add a split at the beginning which brings the total percentage to 100%.
      else
        processedSplits.unshift({
          projectId,
          address: projectOwnerAddress!,
          percent: `${formatSplitPercent(remainingPercentage)}%`,
        })
    }

    return processedSplits
  }, [reservedTokensSplits, projectOwnerAddress, projectId])

  const reservedRate = `${formatReservedRate(reservedRateWad)}%`
  const reservedTokens = formatAmount(fromWad(reservedTokensWad))

  return { reservedList, reservedTokens, reservedRate, loading }
}
