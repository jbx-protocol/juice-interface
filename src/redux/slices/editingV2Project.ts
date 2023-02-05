import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AllocationSplit } from 'components/Allocation'
import { projectTokenSettingsToReduxFormat } from 'components/Create/utils/projectTokenSettingsToReduxFormat'
import { JB721_DELEGATE_V1 } from 'constants/delegateVersions'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { CreatePage } from 'models/create-page'
import { FundingTargetType } from 'models/fundingTargetType'
import {
  JBTiered721Flags,
  DelegateVersion,
  JB721GovernanceType,
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewardTier'
import { PayoutsSelection } from 'models/payoutsSelection'
import {
  LATEST_METADATA_VERSION,
  ProjectMetadataV5,
} from 'models/project-metadata'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
  Split,
} from 'models/splits'
import {
  DEFAULT_MINT_RATE,
  issuanceRateFrom,
  redemptionRateFrom,
} from 'utils/v2v3/math'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

export type NftRewardsData = {
  rewardTiers: NftRewardTier[] | undefined
  CIDs: string[] | undefined // points to locations of the NFTs' json on IPFS
  collectionMetadata: NftCollectionMetadata
  postPayModal: NftPostPayModalConfig | undefined
  flags: JBTiered721Flags
  contractVersion: DelegateVersion | undefined
  governanceType: JB721GovernanceType
}

export interface CreateState {
  fundingCyclesPageSelection: 'automated' | 'manual' | undefined
  fundingTargetSelection: FundingTargetType | undefined
  payoutsSelection: PayoutsSelection | undefined
  projectTokensSelection: ProjectTokensSelection | undefined
  reconfigurationRuleSelection: ReconfigurationStrategy | undefined
  createFurthestPageReached: CreatePage
  createSoftLockPageQueue: CreatePage[] | undefined
}

export interface ProjectState {
  projectMetadata: ProjectMetadataV5
  fundingCycleData: SerializedV2V3FundingCycleData
  fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
  fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
  payoutGroupedSplits: ETHPayoutGroupedSplits
  reservedTokensGroupedSplits: ReservedTokensGroupedSplits
  nftRewards: NftRewardsData
  mustStartAtOrAfter: string
  inputProjectOwner: string | undefined
}

interface ReduxState extends CreateState, ProjectState {
  version: number
}

// Increment this version by 1 when making breaking or major changes.
// When users return to the site and their local version is less than
// this number, their state will be reset.
export const REDUX_STORE_V2_PROJECT_VERSION = 12

export const DEFAULT_MUST_START_AT_OR_AFTER = '1'

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
export const defaultFundingCycleData: SerializedV2V3FundingCycleData =
  serializeV2V3FundingCycleData({
    duration: BigNumber.from(0),
    weight: BigNumber.from(issuanceRateFrom(DEFAULT_MINT_RATE.toString())), // 1e24, resulting in 1,000,000 tokens per ETH
    discountRate: BigNumber.from(0), // A number from 0-1,000,000,000
    ballot: constants.AddressZero,
  })

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
export const defaultFundingCycleMetadata: SerializedV2V3FundingCycleMetadata =
  serializeV2V3FundingCycleMetadata({
    global: {
      allowSetTerminals: false,
      allowSetController: false,
      pauseTransfers: false,
    },
    reservedRate: BigNumber.from(0), // A number from 0-10,000
    redemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
    ballotRedemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
    pausePay: false,
    pauseDistributions: false,
    pauseRedeem: false,
    allowMinting: false,
    pauseBurn: false,
    preferClaimedTokenOverride: false,
    allowTerminalMigration: false,
    allowControllerMigration: false,
    holdFees: false,
    useTotalOverflowForRedemptions: false,
    useDataSourceForPay: false,
    useDataSourceForRedeem: false,
    dataSource: constants.AddressZero,
    metadata: BigNumber.from(0),
  }) ?? {}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
const EMPTY_PAYOUT_GROUPED_SPLITS = {
  group: ETH_PAYOUT_SPLIT_GROUP,
  splits: [],
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
export const EMPTY_RESERVED_TOKENS_GROUPED_SPLITS = {
  group: RESERVED_TOKEN_SPLIT_GROUP,
  splits: [],
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
export const EMPTY_NFT_COLLECTION_METADATA = {
  symbol: undefined,
  name: undefined,
  CID: undefined,
  description: undefined,
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
export const DEFAULT_NFT_FLAGS: JBTiered721Flags = {
  lockReservedTokenChanges: false,
  lockVotingUnitChanges: false,
  lockManualMintingChanges: false,
  preventOverspending: false,
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
const defaultCreateState: CreateState = {
  reconfigurationRuleSelection: undefined,
  fundingCyclesPageSelection: undefined,
  createFurthestPageReached: 'projectDetails',
  createSoftLockPageQueue: [],
  fundingTargetSelection: undefined,
  payoutsSelection: undefined,
  projectTokensSelection: undefined,
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
const defaultProjectMetadataState: ProjectMetadataV5 = {
  name: '',
  infoUri: '',
  logoUri: '',
  description: '',
  twitter: '',
  discord: '',
  tokens: [],
  nftPaymentSuccessModal: undefined,
  version: LATEST_METADATA_VERSION,
}

// IF CHANGING ANY DEFAULT STATE, MUST INCREMENT REDUX VERSION ABOVE (`REDUX_STORE_V2_PROJECT_VERSION`)
const defaultProjectState: ProjectState = {
  projectMetadata: { ...defaultProjectMetadataState },
  fundingCycleData: { ...defaultFundingCycleData },
  fundingCycleMetadata: { ...defaultFundingCycleMetadata },
  fundAccessConstraints: [],
  payoutGroupedSplits: EMPTY_PAYOUT_GROUPED_SPLITS,
  reservedTokensGroupedSplits: EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
  nftRewards: {
    rewardTiers: [],
    CIDs: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    postPayModal: undefined,
    flags: DEFAULT_NFT_FLAGS,
    contractVersion: JB721_DELEGATE_V1,
    governanceType: JB721GovernanceType.NONE,
  },
  mustStartAtOrAfter: DEFAULT_MUST_START_AT_OR_AFTER,
  inputProjectOwner: undefined,
}

export const defaultReduxState: ReduxState = {
  version: REDUX_STORE_V2_PROJECT_VERSION,
  ...defaultProjectState,
  ...defaultCreateState,
}

const editingV2ProjectSlice = createSlice({
  name: 'editingV2Project',
  initialState: defaultReduxState,
  reducers: {
    setState: (_, action: PayloadAction<ReduxState>) => {
      return action.payload
    },
    resetState: () => defaultReduxState,
    setName: (state, action: PayloadAction<string>) => {
      state.projectMetadata.name = action.payload
    },
    setInfoUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.infoUri = action.payload
    },
    setLogoUri: (state, action: PayloadAction<string>) => {
      state.projectMetadata.logoUri = action.payload
    },
    setTwitter: (state, action: PayloadAction<string>) => {
      state.projectMetadata.twitter = action.payload
    },
    setDiscord: (state, action: PayloadAction<string>) => {
      state.projectMetadata.discord = action.payload
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
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
