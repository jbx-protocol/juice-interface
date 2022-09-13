import useProjectDistributionLimit from 'hooks/v3/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v3/contractReader/ProjectSplits'
import { Split } from 'models/splits'
import { useContext, useEffect, useState } from 'react'
import {
  defaultFundingCycleMetadata,
  editingV3ProjectActions,
} from 'redux/slices/editingV3Project'
import { fromWad } from 'utils/formatNumber'
import { NO_CURRENCY, V3_CURRENCY_ETH } from 'utils/v3/currency'
import { decodeV2FundingCycleMetadata } from 'utils/v3/fundingCycle'
import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  serializeV3FundingCycleData,
  serializeV3FundingCycleMetadata,
} from 'utils/v3/serializers'

import { V3ProjectContext } from 'contexts/v3/projectContext'

import useProjectQueuedFundingCycle from 'hooks/v3/contractReader/ProjectQueuedFundingCycle'

import { V3UserContext } from 'contexts/v3/userContext'

import { useAppDispatch } from 'hooks/AppDispatch'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'

export interface InitialEditingData {
  fundAccessConstraints: SerializedV2FundAccessConstraint[]
  fundingCycleData: SerializedV2FundingCycleData
  fundingCycleMetadata: SerializedV2FundingCycleMetadata
  payoutGroupedSplits: {
    payoutGroupedSplits: Split[]
    reservedTokensGroupedSplits: Split[]
  }
}

export const useInitialEditingData = (visible: boolean) => {
  const [initialEditingData, setInitialEditingData] = useState<{
    fundAccessConstraints: SerializedV2FundAccessConstraint[]
    fundingCycleData: SerializedV2FundingCycleData
    fundingCycleMetadata: SerializedV2FundingCycleMetadata
    payoutGroupedSplits: {
      payoutGroupedSplits: Split[]
      reservedTokensGroupedSplits: Split[]
    }
  }>()

  const { contracts } = useContext(V3UserContext)
  const dispatch = useAppDispatch()

  const {
    projectId,
    primaryTerminal,
    fundingCycle,
    payoutSplits,
    reservedTokensSplits,
    distributionLimit,
    distributionLimitCurrency,
  } = useContext(V3ProjectContext)

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse ?? []
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

  // Populates the local redux state from V3ProjectContext values
  useEffect(() => {
    if (!visible || !effectiveFundingCycle) return

    // Build fundAccessConstraint
    let fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
      undefined
    if (effectiveDistributionLimit) {
      const distributionLimitCurrency =
        effectiveDistributionLimitCurrency?.toNumber() ?? V3_CURRENCY_ETH

      fundAccessConstraint = {
        terminal: contracts?.JBETHPaymentTerminal.address ?? '',
        token: ETH_TOKEN_ADDRESS,
        distributionLimit: fromWad(effectiveDistributionLimit),
        distributionLimitCurrency:
          distributionLimitCurrency === NO_CURRENCY
            ? V3_CURRENCY_ETH.toString()
            : distributionLimitCurrency.toString(),
        overflowAllowance: '0', // nothing for the time being.
        overflowAllowanceCurrency: '0',
      }
    }
    const editingFundAccessConstraints = fundAccessConstraint
      ? [fundAccessConstraint]
      : []
    dispatch(
      editingV3ProjectActions.setFundAccessConstraints(
        fundAccessConstraint ? [fundAccessConstraint] : [],
      ),
    )

    // Set editing funding cycle
    const editingFundingCycleData = fundingCycle?.weight
      ? serializeV3FundingCycleData({
          ...effectiveFundingCycle,
          weight: fundingCycle.weight,
        })
      : serializeV3FundingCycleData(effectiveFundingCycle)

    dispatch(
      editingV3ProjectActions.setFundingCycleData(editingFundingCycleData),
    )

    // Set editing funding metadata
    const editingFundingCycleMetadata = effectiveFundingCycle.metadata
      ? serializeV3FundingCycleMetadata(
          decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
        )
      : defaultFundingCycleMetadata
    if (effectiveFundingCycle?.metadata) {
      dispatch(
        editingV3ProjectActions.setFundingCycleMetadata(
          serializeV3FundingCycleMetadata(
            decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
          ),
        ),
      )
    }

    // Set editing payout splits
    dispatch(
      editingV3ProjectActions.setPayoutSplits(effectivePayoutSplits ?? []),
    )

    // Set reserve token splits
    dispatch(
      editingV3ProjectActions.setReservedTokensSplits(
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
