import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import useProjectDistributionLimit from 'packages/v2v3/hooks/contractReader/useProjectDistributionLimit'
import useProjectQueuedFundingCycle from 'packages/v2v3/hooks/contractReader/useProjectQueuedFundingCycle'
import useProjectSplits from 'packages/v2v3/hooks/contractReader/useProjectSplits'
import { Split } from 'packages/v2v3/models/splits'
import { NO_CURRENCY, V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'packages/v2v3/utils/serializers'
import { useContext, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  editingV2ProjectActions,
} from 'redux/slices/v2v3/editingV2Project'
import { NftRewardsData } from 'redux/slices/v2v3/shared/v2ProjectTypes'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { fromWad } from 'utils/format/formatNumber'

interface InitialEditingData {
  fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
  fundingCycleData: SerializedV2V3FundingCycleData
  fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
  payoutGroupedSplits: {
    payoutGroupedSplits: Split[]
    reservedTokensGroupedSplits: Split[]
  }
  nftRewards: NftRewardsData | undefined
  mustStartAtOrAfter: string | undefined
}

/**
 * Populate the Redux store with the in-context project data.
 *
 * Used to set up Redux when a user wants to edit their project somehow.
 */
export const useInitialEditingData = ({
  visible,
}: {
  visible?: boolean
}): { initialEditingData: InitialEditingData | undefined } => {
  const { contracts } = useContext(V2V3ContractsContext)
  const {
    primaryETHTerminal,
    fundingCycle,
    fundingCycleMetadata,
    payoutSplits,
    reservedTokensSplits,
    distributionLimit,
    distributionLimitCurrency,
  } = useContext(V2V3ProjectContext)

  const { nftRewards } = useContext(NftRewardsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const [initialEditingData, setInitialEditingData] =
    useState<InitialEditingData>()

  const dispatch = useAppDispatch()

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [queuedFundingCycle, queuedFundingCycleMetadata] =
    queuedFundingCycleResponse ?? []

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedReservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: queuedFundingCycle?.configuration.toString(),
    terminal: primaryETHTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  // Use data from the queued funding cycle (if it exists).
  const effectiveFundingCycle = queuedFundingCycle?.number.gt(0)
    ? queuedFundingCycle
    : fundingCycle
  const effectiveFundingCycleMetadata = queuedFundingCycle?.number.gt(0)
    ? queuedFundingCycleMetadata
    : fundingCycleMetadata
  const effectivePayoutSplits = queuedFundingCycle?.number.gt(0)
    ? queuedPayoutSplits
    : payoutSplits
  const effectiveReservedTokensSplits = queuedFundingCycle?.number.gt(0)
    ? queuedReservedTokensSplits
    : reservedTokensSplits

  let effectiveDistributionLimit = distributionLimit
  if (effectiveFundingCycle?.duration.gt(0) && queuedDistributionLimit) {
    effectiveDistributionLimit = queuedDistributionLimit
  }

  let effectiveDistributionLimitCurrency = distributionLimitCurrency
  if (
    effectiveFundingCycle?.duration.gt(0) &&
    queuedDistributionLimitCurrency
  ) {
    effectiveDistributionLimitCurrency = queuedDistributionLimitCurrency
  }

  // Populates the local redux state from V2V3ProjectContext values
  useDeepCompareEffect(() => {
    if (!visible || !effectiveFundingCycle || !effectiveFundingCycleMetadata)
      return

    // Build fundAccessConstraint
    let fundAccessConstraint: SerializedV2V3FundAccessConstraint | undefined =
      undefined
    if (effectiveDistributionLimit) {
      const distributionLimitCurrency =
        effectiveDistributionLimitCurrency?.toNumber() ?? V2V3_CURRENCY_ETH

      fundAccessConstraint = {
        terminal: primaryETHTerminal ?? '',
        token: ETH_TOKEN_ADDRESS,
        distributionLimit: fromWad(effectiveDistributionLimit),
        distributionLimitCurrency:
          distributionLimitCurrency === NO_CURRENCY
            ? V2V3_CURRENCY_ETH.toString()
            : distributionLimitCurrency.toString(),
        overflowAllowance: '0', // nothing for the time being.
        overflowAllowanceCurrency: '0',
      }
    }
    const editingFundAccessConstraints = fundAccessConstraint
      ? [fundAccessConstraint]
      : []
    dispatch(
      editingV2ProjectActions.setFundAccessConstraints(
        fundAccessConstraint ? [fundAccessConstraint] : [],
      ),
    )

    // Set editing funding cycle
    const editingFundingCycleData = fundingCycle?.weight
      ? serializeV2V3FundingCycleData({
          ...effectiveFundingCycle,
          weight: fundingCycle.weight,
        })
      : serializeV2V3FundingCycleData(effectiveFundingCycle)

    dispatch(
      editingV2ProjectActions.setFundingCycleData(editingFundingCycleData),
    )

    const editingFundingCycleMetadata = serializeV2V3FundingCycleMetadata(
      effectiveFundingCycleMetadata,
    )

    // Set editing funding cycle metadata
    dispatch(
      editingV2ProjectActions.setFundingCycleMetadata(
        editingFundingCycleMetadata,
      ),
    )

    // Set editing payout splits
    dispatch(
      editingV2ProjectActions.setPayoutSplits(effectivePayoutSplits ?? []),
    )

    // Set reserve token splits
    dispatch(
      editingV2ProjectActions.setReservedTokensSplits(
        effectiveReservedTokensSplits ?? [],
      ),
    )

    // Set nft rewards
    dispatch(editingV2ProjectActions.setNftRewards(nftRewards))

    setInitialEditingData({
      fundAccessConstraints: editingFundAccessConstraints,
      fundingCycleData: editingFundingCycleData,
      fundingCycleMetadata: editingFundingCycleMetadata,
      payoutGroupedSplits: {
        payoutGroupedSplits: effectivePayoutSplits ?? [],
        reservedTokensGroupedSplits: effectiveReservedTokensSplits ?? [],
      },
      nftRewards,
      mustStartAtOrAfter: DEFAULT_MUST_START_AT_OR_AFTER,
    })
  }, [
    contracts,
    effectiveFundingCycle,
    effectiveFundingCycleMetadata,
    effectivePayoutSplits,
    effectiveReservedTokensSplits,
    effectiveDistributionLimit,
    effectiveDistributionLimitCurrency,
    fundingCycle,
    visible,
    nftRewards,
    dispatch,
  ])

  return { initialEditingData }
}
