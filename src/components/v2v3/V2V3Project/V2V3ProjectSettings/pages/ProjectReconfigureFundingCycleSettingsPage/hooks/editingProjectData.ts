import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'

export interface EditingProjectData {
  editingPayoutGroupedSplits: ETHPayoutGroupedSplits
  editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits
  editingFundingCycleMetadata: Omit<V2V3FundingCycleMetadata, 'version'>
  editingFundingCycleData: V2V3FundingCycleData
  editingFundAccessConstraints: V2V3FundAccessConstraint[]
}

export const useEditingProjectData = () => {
  // Gets values from the redux state to be used in the modal drawer fields
  const {
    payoutGroupedSplits: editingPayoutGroupedSplits,
    reservedTokensGroupedSplits: editingReservedTokensGroupedSplits,
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
  }
}
