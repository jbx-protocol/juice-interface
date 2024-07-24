import { WeiPerEther } from '@ethersproject/constants'
import { SplitPortion, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRulesetMetadata,
  useReadJbTokensTotalCreditSupplyOf,
} from 'juice-sdk-react'
import useProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { useMemo } from 'react'
import assert from 'utils/assert'
import { formatAmount } from 'utils/format/formatAmount'

export const useV4ReservedTokensSubPanel = () => {
  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useProjectOwnerOf()
  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const reservedPercent = `${rulesetMetadata?.reservedPercent.formatPercentage()}%`

  const { data: totalCreditSupply } = useReadJbTokensTotalCreditSupplyOf({
    args: [projectId],
  })

  const reservedList = useMemo(() => {
    if (!projectOwnerAddress || !projectId || !reservedTokensSplits) return
    // If there aren't explicitly defined splits, all reserved tokens go to this project.
    if (reservedTokensSplits?.length === 0)
      return [
        {
          projectId: Number(projectId),
          address: projectOwnerAddress!,
          percent: `${new SplitPortion(
            SPLITS_TOTAL_PERCENT,
          ).formatPercentage()}%`,
        },
      ]

    // If the splits don't add up to 100%, remaining tokens go to this project.
    let splitsPercentTotal = 0
    const processedSplits = reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        splitsPercentTotal += Number(split.percent.value)

        return {
          projectId: Number(split.projectId),
          address: split.beneficiary!,
          percent: `${split.percent.formatPercentage()}%`,
        }
      })

    const remainingPercentage = SPLITS_TOTAL_PERCENT - splitsPercentTotal

    // Check if this project is already one of the splits.
    if (!(remainingPercentage === 0)) {
      const projectSplitIndex = processedSplits.findIndex(
        v => v.projectId === Number(projectId),
      )
      if (projectSplitIndex != -1)
        // If it is, increase its split percentage to bring the total to 100%.
        processedSplits[projectSplitIndex].percent = `${new SplitPortion(
          remainingPercentage +
            Number(reservedTokensSplits[projectSplitIndex].percent.value),
        ).formatPercentage()}%`
      // If it isn't, add a split at the beginning which brings the total percentage to 100%.
      else
        processedSplits.unshift({
          projectId: Number(projectId),
          address: projectOwnerAddress!,
          percent: `${new SplitPortion(
            remainingPercentage,
          ).formatPercentage()}%`,
        })
    }

    return processedSplits
  }, [reservedTokensSplits, projectOwnerAddress, projectId])

  const totalCreditSupplyFormatted = useMemo(() => {
    if (totalCreditSupply === undefined) return
    return formatAmount(Number(totalCreditSupply / WeiPerEther.toBigInt()), {
      maximumFractionDigits: 2,
    })
  }, [totalCreditSupply])

  return {
    reservedList,
    totalCreditSupply: totalCreditSupplyFormatted,
    reservedPercent,
  }
}
