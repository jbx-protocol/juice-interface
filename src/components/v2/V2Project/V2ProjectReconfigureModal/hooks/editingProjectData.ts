import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import {
  V2FundingCycleMetadata,
  V2FundingCycleData,
  V2FundAccessConstraint,
} from 'models/v2/fundingCycle'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/v2/splits'

export interface EditingProjectData {
  editingPayoutGroupedSplits: ETHPayoutGroupedSplits
  editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits
  editingFundingCycleMetadata: Omit<V2FundingCycleMetadata, 'version'>
  editingFundingCycleData: V2FundingCycleData
  editingFundAccessConstraints: V2FundAccessConstraint[]
}

export const useEditingProjectData = () => {
  // Gets values from the redux state to be used in the modal drawer fields
  const {
    payoutGroupedSplits: editingPayoutGroupedSplits,
    reservedTokensGroupedSplits: editingReservedTokensGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)
  const editingFundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const editingFundingCycleData = useEditingV2FundingCycleDataSelector()
  const editingFundAccessConstraints =
    useEditingV2FundAccessConstraintsSelector()

  return {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
  }
}
