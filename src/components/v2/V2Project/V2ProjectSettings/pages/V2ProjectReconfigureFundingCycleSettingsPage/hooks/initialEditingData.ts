import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import { Split } from 'models/splits'
import { useContext, useEffect, useState } from 'react'
import {
  defaultFundingCycleMetadata,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/format/formatNumber'
import { NO_CURRENCY, V2_CURRENCY_ETH } from 'utils/v2/currency'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'
import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  serializeV2FundingCycleData,
  serializeV2FundingCycleMetadata,
} from 'utils/v2/serializers'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'

import { V2UserContext } from 'contexts/v2/userContext'

import { useAppDispatch } from 'hooks/AppDispatch'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

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

  const { contracts } = useContext(V2UserContext)
  const dispatch = useAppDispatch()

  const {
    projectId,
    primaryTerminal,
    fundingCycle,
    payoutSplits,
    reservedTokensSplits,
    distributionLimit,
    distributionLimitCurrency,
  } = useContext(V2ProjectContext)

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

  // Populates the local redux state from V2ProjectContext values
  useEffect(() => {
    if (!visible || !effectiveFundingCycle) return

    // Build fundAccessConstraint
    let fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
      undefined
    if (effectiveDistributionLimit) {
      const distributionLimitCurrency =
        effectiveDistributionLimitCurrency?.toNumber() ?? V2_CURRENCY_ETH

      fundAccessConstraint = {
        terminal: contracts?.JBETHPaymentTerminal.address ?? '',
        token: ETH_TOKEN_ADDRESS,
        distributionLimit: fromWad(effectiveDistributionLimit),
        distributionLimitCurrency:
          distributionLimitCurrency === NO_CURRENCY
            ? V2_CURRENCY_ETH.toString()
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
      ? serializeV2FundingCycleData({
          ...effectiveFundingCycle,
          weight: fundingCycle.weight,
        })
      : serializeV2FundingCycleData(effectiveFundingCycle)

    dispatch(
      editingV2ProjectActions.setFundingCycleData(editingFundingCycleData),
    )

    // Set editing funding metadata
    const editingFundingCycleMetadata = effectiveFundingCycle.metadata
      ? serializeV2FundingCycleMetadata(
          decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
        )
      : defaultFundingCycleMetadata
    if (effectiveFundingCycle?.metadata) {
      dispatch(
        editingV2ProjectActions.setFundingCycleMetadata(
          serializeV2FundingCycleMetadata(
            decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
          ),
        ),
      )
    }

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
