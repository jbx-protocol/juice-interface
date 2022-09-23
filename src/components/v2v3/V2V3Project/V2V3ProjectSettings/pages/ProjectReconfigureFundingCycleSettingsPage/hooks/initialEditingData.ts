import useProjectDistributionLimit from 'hooks/v2v3/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v2v3/contractReader/ProjectSplits'
import { Split } from 'models/splits'
import { useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/format/formatNumber'
import { NO_CURRENCY, V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'

import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/ProjectQueuedFundingCycle'

import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'

import { useAppDispatch } from 'hooks/AppDispatch'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'

export interface InitialEditingData {
  fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
  fundingCycleData: SerializedV2V3FundingCycleData
  fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
  payoutGroupedSplits: {
    payoutGroupedSplits: Split[]
    reservedTokensGroupedSplits: Split[]
  }
}

export const useInitialEditingData = (visible: boolean) => {
  const [initialEditingData, setInitialEditingData] = useState<{
    fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
    fundingCycleData: SerializedV2V3FundingCycleData
    fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
    payoutGroupedSplits: {
      payoutGroupedSplits: Split[]
      reservedTokensGroupedSplits: Split[]
    }
  }>()

  const { contracts } = useContext(V2V3ContractsContext)
  const dispatch = useAppDispatch()

  const {
    primaryTerminal,
    fundingCycle,
    fundingCycleMetadata,
    payoutSplits,
    reservedTokensSplits,
    distributionLimit,
    distributionLimitCurrency,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

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
    terminal: primaryTerminal,
  })

  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

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
  useEffect(() => {
    if (!visible || !effectiveFundingCycle || !effectiveFundingCycleMetadata)
      return

    // Build fundAccessConstraint
    let fundAccessConstraint: SerializedV2V3FundAccessConstraint | undefined =
      undefined
    if (effectiveDistributionLimit) {
      const distributionLimitCurrency =
        effectiveDistributionLimitCurrency?.toNumber() ?? V2V3_CURRENCY_ETH

      fundAccessConstraint = {
        terminal: contracts?.JBETHPaymentTerminal.address ?? '',
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

    setInitialEditingData({
      fundAccessConstraints: editingFundAccessConstraints,
      fundingCycleData: editingFundingCycleData,
      fundingCycleMetadata: editingFundingCycleMetadata,
      payoutGroupedSplits: {
        payoutGroupedSplits: effectivePayoutSplits ?? [],
        reservedTokensGroupedSplits: effectiveReservedTokensSplits ?? [],
      },
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
    dispatch,
  ])

  return { initialEditingData }
}
