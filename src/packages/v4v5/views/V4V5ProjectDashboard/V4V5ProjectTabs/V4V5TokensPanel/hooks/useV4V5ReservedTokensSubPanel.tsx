import {
  JBChainId,
  SPLITS_TOTAL_PERCENT,
  SplitPortion,
  formatEther,
  jbDirectoryAbi,
  jbControllerAbi,
  jbContractAddress,
  JBCoreContracts,
} from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBUpcomingRuleset,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'

import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { NETWORKS } from 'constants/networks'
import { Tooltip } from 'antd'
import assert from 'utils/assert'
import { useJBRulesetByChain } from 'packages/v4v5/hooks/useJBRulesetByChain'
import { useMemo } from 'react'
import { useReservedTokensSelectedChain } from '../../V4V5CyclesPayoutsPanel/contexts/ReservedTokensSelectedChainContext'
import { useSuckersPendingReservedTokens } from 'packages/v4v5/hooks/useSuckersPendingReservedTokens'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4V5ReservedSplits } from 'packages/v4v5/hooks/useV4V5ReservedSplits'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

export const useV4V5ReservedTokensSubPanel = () => {
  const { selectedChainId, setSelectedChainId } =
    useReservedTokensSelectedChain()
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

  const { projectId } = useJBProjectId(selectedChainId)

  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf(selectedChainId)
  const { splits: reservedTokensSplits } = useV4V5ReservedSplits(selectedChainId)

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

  const directoryAddress = selectedChainId ? jbContractAddress[versionString][JBCoreContracts.JBDirectory][selectedChainId] : undefined

  const { data: controllerAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: directoryAddress,
    functionName: 'controllerOf',
    args: [projectIdBigInt],
    chainId: selectedChainId,
  })

  const { data: pendingReservedTokens } = useReadContract({
    abi: jbControllerAbi,
    address: controllerAddress,
    functionName: 'pendingReservedTokenBalanceOf',
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
