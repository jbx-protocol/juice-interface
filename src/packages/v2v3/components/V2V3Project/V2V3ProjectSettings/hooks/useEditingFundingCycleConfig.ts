import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'packages/v2v3/models/splits'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/v2v3/edit'
import { NftRewardsData } from 'redux/slices/v2v3/shared/v2ProjectTypes'

export interface EditingFundingCycleConfig {
  editingPayoutGroupedSplits: ETHPayoutGroupedSplits
  editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits
  editingFundingCycleMetadata: Omit<V2V3FundingCycleMetadata, 'version'>
  editingFundingCycleData: V2V3FundingCycleData
  editingFundAccessConstraints: V2V3FundAccessConstraint[]
  editingNftRewards: NftRewardsData | undefined
  editingMustStartAtOrAfter: string
}

export const useEditingFundingCycleConfig = (): EditingFundingCycleConfig => {
  // Gets values from the redux state to be used in the modal drawer fields
  const {
    payoutGroupedSplits: editingPayoutGroupedSplits,
    reservedTokensGroupedSplits: editingReservedTokensGroupedSplits,
    nftRewards: editingNftRewards,
    mustStartAtOrAfter: editingMustStartAtOrAfter,
  } = useAppSelector(state => state.editingV2Project)
  const editingFundingCycleMetadata =
    useEditingV2V3FundingCycleMetadataSelector()
  const editingFundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const editingFundAccessConstraints =
    useEditingV2V3FundAccessConstraintsSelector()

  return {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingNftRewards,
    editingMustStartAtOrAfter,
  }
}
