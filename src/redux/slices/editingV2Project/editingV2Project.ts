import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AmountInputValue } from 'components/Create/components/pages/ProjectDetails/ProjectDetailsPage'
import { projectTokenSettingsToReduxFormat } from 'components/Create/utils/projectTokenSettingsToReduxFormat'
import { AllocationSplit } from 'components/v2v3/shared/Allocation/Allocation'
import { CreatePage } from 'models/createPage'
import {
  JB721GovernanceType,
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewards'
import { PayoutsSelection } from 'models/payoutsSelection'
import { ProjectTagName } from 'models/project-tags'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { Split } from 'models/splits'
import { TreasurySelection } from 'models/treasurySelection'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'
import {
  DEFAULT_REDUX_STATE,
  EMPTY_PAYOUT_GROUPED_SPLITS,
  EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
} from './defaultState'
import { NftRewardsData, ReduxState } from './types'
import { REDUX_STORE_V2_PROJECT_VERSION } from './version'

export const INITIAL_REDUX_STATE = {
  version: REDUX_STORE_V2_PROJECT_VERSION,
  ...DEFAULT_REDUX_STATE,
}

const editingV2ProjectSlice = createSlice({
  name: 'editingV2Project',
  initialState: INITIAL_REDUX_STATE,
  reducers: {
    setState: (_, action: PayloadAction<ReduxState>) => {
      return action.payload
    },
    resetState: () => INITIAL_REDUX_STATE,
    setName: (state, action: PayloadAction<string>) => {
      state.projectMetadata.name = action.payload
    },
    setProjectTagline: (state, action: PayloadAction<string>) => {
      state.projectMetadata.projectTagline = action.payload
    },
    setRequiredOFACCheck: (
      state,
      action: PayloadAction<boolean | undefined>,
    ) => {
      state.projectMetadata.projectRequiredOFACCheck = action.payload
    },
    setInfoUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.infoUri = action.payload
    },
    setLogoUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.logoUri = action.payload
    },
    setCoverImageUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.coverImageUri = action.payload
    },
    setTwitter: (state, action: PayloadAction<string>) => {
      state.projectMetadata.twitter = action.payload
    },
    setDiscord: (state, action: PayloadAction<string>) => {
      state.projectMetadata.discord = action.payload
    },
    setTelegram: (state, action: PayloadAction<string>) => {
      state.projectMetadata.telegram = action.payload
    },
    setPayButton: (state, action: PayloadAction<string>) => {
      state.projectMetadata.payButton = action.payload
    },
    setPayDisclosure: (state, action: PayloadAction<string>) => {
      state.projectMetadata.payDisclosure = action.payload
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.projectMetadata.description = action.payload
    },
    setTags: (state, action: PayloadAction<ProjectTagName[]>) => {
      state.projectMetadata.tags = action.payload
    },
    setFundingCycleData: (
      state,
      action: PayloadAction<SerializedV2V3FundingCycleData>,
    ) => {
      state.fundingCycleData = action.payload
    },
    setFundingCycleMetadata: (
      state,
      action: PayloadAction<SerializedV2V3FundingCycleMetadata>,
    ) => {
      state.fundingCycleMetadata = action.payload
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.duration = action.payload
    },
    setDiscountRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.discountRate = action.payload
    },
    setReservedRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleMetadata.reservedRate = action.payload
    },
    setRedemptionRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleMetadata.redemptionRate = action.payload
    },
    setBallotRedemptionRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleMetadata.ballotRedemptionRate = action.payload
    },
    setWeight: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.weight = action.payload
    },
    setFundAccessConstraints: (
      state,
      action: PayloadAction<SerializedV2V3FundAccessConstraint[]>,
    ) => {
      state.fundAccessConstraints = action.payload
    },
    setDistributionLimit: (state, action: PayloadAction<string>) => {
      if (state.fundAccessConstraints.length) {
        state.fundAccessConstraints[0].distributionLimit = action.payload
      }
    },
    setDistributionLimitCurrency: (state, action: PayloadAction<string>) => {
      if (state.fundAccessConstraints.length) {
        state.fundAccessConstraints[0].distributionLimitCurrency =
          action.payload
      }
    },
    setTreasurySelection: (
      state,
      action: PayloadAction<TreasurySelection | undefined>,
    ) => {
      state.treasurySelection = action.payload
    },
    setFundingTargetSelection: (
      state,
      action: PayloadAction<'specific' | 'infinite' | undefined>,
    ) => {
      state.fundingTargetSelection = action.payload
    },
    setPayoutSplits: (state, action: PayloadAction<Split[]>) => {
      state.payoutGroupedSplits = {
        ...EMPTY_PAYOUT_GROUPED_SPLITS,
        splits: action.payload,
      }
    },
    setPayoutsSelection: (
      state,
      action: PayloadAction<PayoutsSelection | undefined>,
    ) => {
      state.payoutsSelection = action.payload
    },
    setReservedTokensSplits: (state, action: PayloadAction<Split[]>) => {
      state.reservedTokensGroupedSplits = {
        ...EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
        splits: action.payload,
      }
    },
    setProjectTokensSelection: (
      state,
      action: PayloadAction<ProjectTokensSelection | undefined>,
    ) => {
      state.projectTokensSelection = action.payload
    },
    setPausePay: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.pausePay = action.payload
    },
    setHoldFees: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.holdFees = action.payload
    },
    setAllowMinting: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.allowMinting = action.payload
    },
    setBallot: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.ballot = action.payload
    },
    setNftRewards: (state, action: PayloadAction<NftRewardsData>) => {
      state.nftRewards = action.payload
    },
    setNftRewardTiers: (state, action: PayloadAction<NftRewardTier[]>) => {
      state.nftRewards.rewardTiers = action.payload
    },
    setNftRewardsCIDs: (state, action: PayloadAction<string[]>) => {
      state.nftRewards.CIDs = action.payload
    },
    setNftRewardsCollectionMetadata: (
      state,
      action: PayloadAction<NftCollectionMetadata>,
    ) => {
      state.nftRewards.collectionMetadata = action.payload
    },
    setNftRewardsCollectionMetadataUri: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.nftRewards.collectionMetadata.uri = action.payload
    },
    setNftRewardsSymbol: (state, action: PayloadAction<string | undefined>) => {
      state.nftRewards.collectionMetadata.symbol = action.payload
    },
    setNftRewardsCollectionDescription: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.nftRewards.collectionMetadata.description = action.payload
    },
    setNftRewardsGovernance: (
      state,
      action: PayloadAction<JB721GovernanceType>,
    ) => {
      state.nftRewards.governanceType = action.payload
    },
    setNftPostPayModalConfig: (
      state,
      action: PayloadAction<NftPostPayModalConfig | undefined>,
    ) => {
      state.nftRewards.postPayModal = action.payload
    },
    setNftRewardsName: (state, action: PayloadAction<string>) => {
      state.nftRewards.collectionMetadata.name = action.payload
    },
    setNftPreventOverspending: (state, action: PayloadAction<boolean>) => {
      state.nftRewards.flags.preventOverspending = action.payload
    },
    setAllowSetTerminals: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.global.allowSetTerminals = action.payload
    },
    setAllowSetController: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.global.allowSetController = action.payload
    },
    setAllowControllerMigration: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.allowControllerMigration = action.payload
    },
    setAllowTerminalMigration: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.allowTerminalMigration = action.payload
    },
    setPauseTransfers: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.global.pauseTransfers = action.payload
    },
    setFundingCyclesPageSelection: (
      state,
      action: PayloadAction<'manual' | 'automated' | undefined>,
    ) => {
      state.fundingCyclesPageSelection = action.payload
    },
    setReconfigurationRuleSelection: (
      state,
      action: PayloadAction<ReconfigurationStrategy | undefined>,
    ) => {
      state.reconfigurationRuleSelection = action.payload
    },
    setCreateFurthestPageReached: (
      state,
      action: PayloadAction<CreatePage>,
    ) => {
      state.createFurthestPageReached = action.payload
    },
    setInputProjectOwner: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.inputProjectOwner = action.payload
    },
    setMustStartAtOrAfter: (state, action: PayloadAction<string>) => {
      state.mustStartAtOrAfter = action.payload
    },
    addCreateSoftLockedPage: (state, action: PayloadAction<CreatePage>) => {
      const set = new Set(state.createSoftLockPageQueue)
      set.add(action.payload)
      state.createSoftLockPageQueue = [...set]
    },
    removeCreateSoftLockedPage: (state, action: PayloadAction<CreatePage>) => {
      if (!state.createSoftLockPageQueue) return
      if (state.createSoftLockPageQueue.includes(action.payload)) {
        state.createSoftLockPageQueue.splice(
          state.createSoftLockPageQueue.indexOf(action.payload),
          1,
        )
      }
    },
    setUseDataSourceForRedeem: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.useDataSourceForRedeem = action.payload
    },
    setTokenSettings: (
      state,
      action: PayloadAction<{
        initialMintRate: string
        reservedTokensPercentage: number
        reservedTokenAllocation: AllocationSplit[]
        discountRate: number
        redemptionRate: number
        tokenMinting: boolean
        pauseTransfers: boolean
      }>,
    ) => {
      const converted = projectTokenSettingsToReduxFormat(action.payload)

      state.fundingCycleData.weight = converted.weight
      state.fundingCycleMetadata.reservedRate = converted.reservedRate
      state.reservedTokensGroupedSplits = converted.reservedTokensGroupedSplits
      state.fundingCycleData.discountRate = converted.discountRate
      state.fundingCycleMetadata.redemptionRate = converted.redemptionRate
      state.fundingCycleMetadata.allowMinting = converted.allowMinting
    },
    setIntroVideoUrl: (state, action: PayloadAction<string>) => {
      state.projectMetadata.introVideoUrl = action.payload
    },
    setIntroImageUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.introImageUri = action.payload
    },
    setSoftTarget: (state, action: PayloadAction<AmountInputValue>) => {
      state.projectMetadata.softTargetAmount = action.payload.amount
      state.projectMetadata.softTargetCurrency =
        action.payload.currency.toString()
    },
    setSoftTargetAmount: (state, action: PayloadAction<string>) => {
      state.projectMetadata.softTargetAmount = action.payload
    },
    setSoftTargetCurrency: (state, action: PayloadAction<string>) => {
      state.projectMetadata.softTargetCurrency = action.payload
    },
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
