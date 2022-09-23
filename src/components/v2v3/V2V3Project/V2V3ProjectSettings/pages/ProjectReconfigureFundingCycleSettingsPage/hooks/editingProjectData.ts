import {
  useAppSelector,
  useEditingV2FundingCycleMetadataSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
} from 'hooks/AppSelector'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/splits'
import {
  V2FundingCycleMetadata,
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'models/v2/fundingCycle'

export interface EditingProjectData {
  editingPayoutGroupedSplits: ETHPayoutGroupedSplits
  editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits
  editingFundingCycleMetadata: Omit<V2FundingCycleMetadata, 'version'>
  editingFundingCycleData: V2V3FundingCycleData
  editingFundAccessConstraints: V2V3FundAccessConstraint[]
}

export const useEditingProjectData = () => {
  // Gets values from the redux state to be used in the modal drawer fields
  const {
    payoutGroupedSplits: editingPayoutGroupedSplits,
    reservedTokensGroupedSplits: editingReservedTokensGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)
  const editingFundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
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
