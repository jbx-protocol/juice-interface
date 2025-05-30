import {
  JBChainId,
  SPLITS_TOTAL_PERCENT,
  SplitPortion,
  formatEther,
} from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBUpcomingRuleset,
  useReadJbControllerPendingReservedTokenBalanceOf,
  useReadJbDirectoryControllerOf,
} from 'juice-sdk-react'

import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { NETWORKS } from 'constants/networks'
import { Tooltip } from 'antd'
import assert from 'utils/assert'
import { useJBRulesetByChain } from 'packages/v4/hooks/useJBRulesetByChain'
import { useMemo } from 'react'
import { useReservedTokensSelectedChain } from '../../V4CyclesPayoutsPanel/contexts/ReservedTokensSelectedChainContext'
import { useSuckersPendingReservedTokens } from 'packages/v4/hooks/useSuckersPendingReservedTokens'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'

export const useV4ReservedTokensSubPanel = () => {
  const { selectedChainId, setSelectedChainId } =
    useReservedTokensSelectedChain()

  const { projectId } = useJBProjectId(selectedChainId)

  const { data: projectOwnerAddress } = useV4ProjectOwnerOf(selectedChainId)
  const { splits: reservedTokensSplits } = useV4ReservedSplits(selectedChainId)

  const { rulesetMetadata, ruleset } = useJBRulesetByChain(selectedChainId)
  const { rulesetMetadata: upcomingRulesetMetadata } = useJBUpcomingRuleset({ projectId, chainId: selectedChainId })
  
  let _rulesetMetadata
  if (ruleset?.cycleNumber === 0) {
    _rulesetMetadata = upcomingRulesetMetadata
  } else {
    _rulesetMetadata = rulesetMetadata
  }
  const reservedPercent = _rulesetMetadata ? (
    <>{_rulesetMetadata?.reservedPercent.formatPercentage()}%</>
  ) : undefined
  const projectIdBigInt = BigInt(projectId ?? 0)

  const { data: controllerAddress } = useReadJbDirectoryControllerOf({
    chainId: selectedChainId,
    args: [projectIdBigInt],
  })

  const { data: pendingReservedTokens } =
    useReadJbControllerPendingReservedTokenBalanceOf({
      address: controllerAddress,
      args: [projectIdBigInt],
      chainId: selectedChainId,
    })

  const pendingReservedTokensFormatted = useMemo(() => {
    if (pendingReservedTokens === undefined) return
    return formatEther(pendingReservedTokens, { fractionDigits: 6 })
  }, [pendingReservedTokens])

  const { data: suckersPendingReservedTokens } =
    useSuckersPendingReservedTokens()

  const aggregatedPendingReservedTokens =
    suckersPendingReservedTokens?.reduce(
      (acc, curr) => acc + curr.pendingReservedTokens,
      0n,
    ) ?? 0n

  const pendingReservedTokensElement = useMemo(() => {
    return (
      <Tooltip
        title={
          suckersPendingReservedTokens?.length &&
          suckersPendingReservedTokens.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suckersPendingReservedTokens.map(
                ({ chainId, pendingReservedTokens }) => (
                  <div
                    className="flex items-center justify-between gap-4"
                    key={chainId}
                  >
                    <div className="flex items-center gap-2">
                      <ChainLogo chainId={chainId as JBChainId} />
                      <span>{NETWORKS[chainId].label}</span>
                    </div>
                    <span className="whitespace-nowrap font-medium">
                      {formatEther(pendingReservedTokens, {
                        fractionDigits: 6,
                      })}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : undefined
        }
      >
        <span>
          {formatEther(aggregatedPendingReservedTokens, { fractionDigits: 6 })}
        </span>
      </Tooltip>
    )
  }, [suckersPendingReservedTokens, aggregatedPendingReservedTokens])

  const reservedList = useMemo(() => {
    if (!projectOwnerAddress || !projectId || !reservedTokensSplits) return
    if (reservedTokensSplits.length === 0) {
      return [
        {
          projectId: 0,
          address: projectOwnerAddress,
          percent: `${new SplitPortion(
            SPLITS_TOTAL_PERCENT,
          ).formatPercentage()}%`,
        },
      ]
    }

    let splitsPercentTotal = 0
    const processedSplits = reservedTokensSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(split => {
        assert(split.beneficiary, 'Beneficiary must be defined')
        splitsPercentTotal += Number(split.percent.value)

        return {
          projectId: Number(split.projectId),
          address: split.beneficiary,
          percent: `${split.percent.formatPercentage()}%`,
        }
      })

    const remainingPercentage = SPLITS_TOTAL_PERCENT - splitsPercentTotal

    if (remainingPercentage !== 0) {
      const projectSplitIndex = processedSplits.findIndex(
        v => v.projectId === Number(projectId),
      )
      if (projectSplitIndex !== -1) {
        processedSplits[projectSplitIndex].percent = `${new SplitPortion(
          remainingPercentage +
            Number(reservedTokensSplits[projectSplitIndex].percent.value),
        ).formatPercentage()}%`
      } else {
        processedSplits.unshift({
          projectId: 0,
          address: projectOwnerAddress!,
          percent: `${new SplitPortion(
            remainingPercentage,
          ).formatPercentage()}%`,
        })
      }
    }

    return processedSplits
  }, [reservedTokensSplits, projectOwnerAddress, projectId])

  return {
    selectedChainId,
    setSelectedChainId,
    reservedList,
    reservedPercent,
    pendingReservedTokens,
    pendingReservedTokensFormatted,
    aggregatedPendingReservedTokens,
    pendingReservedTokensElement,
  }
}
