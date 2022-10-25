import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  LATEST_METADATA_VERSION,
  ProjectMetadataV5,
} from 'models/project-metadata'

import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
  Split,
} from 'models/splits'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

import {
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewardTier'
import {
  DEFAULT_MINT_RATE,
  discountRateFrom,
  formatIssuanceRate,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'

import { AllocationSplit } from 'components/Create/components/Allocation'
import { allocationToSplit } from 'components/Create/utils/splitToAllocation'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { CreatePage } from 'models/create-page'
import { PayoutsSelection } from 'models/payoutsSelection'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { featureFlagEnabled } from 'utils/featureFlags'

interface V2ProjectState {
  version: number
  projectMetadata: ProjectMetadataV5
  fundingCycleData: SerializedV2V3FundingCycleData
  fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
  fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
  payoutGroupedSplits: ETHPayoutGroupedSplits
  payoutsSelection: PayoutsSelection | undefined
  reservedTokensGroupedSplits: ReservedTokensGroupedSplits
  projectTokensSelection: ProjectTokensSelection | undefined
  nftRewards: {
    rewardTiers: NftRewardTier[]
    CIDs: string[] | undefined // points to locations of the NFTs' json on IPFS
    collectionMetadata: NftCollectionMetadata
    postPayModal: NftPostPayModalConfig | undefined
  }
  fundingCyclesPageSelection: 'automated' | 'manual' | undefined
  reconfigurationRuleSelection: ReconfigurationStrategy | undefined
  createFurthestPageReached: CreatePage
  createSoftLockPageQueue: CreatePage[] | undefined
}

// Increment this version by 1 when making breaking changes.
// When users return to the site and their local version is less than
// this number, their state will be reset.
export const REDUX_STORE_V2_PROJECT_VERSION = 8

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

export const defaultFundingCycleData: SerializedV2V3FundingCycleData =
  serializeV2V3FundingCycleData({
    duration: BigNumber.from(0),
    weight: BigNumber.from(issuanceRateFrom(DEFAULT_MINT_RATE.toString())), // 1e24, resulting in 1,000,000 tokens per ETH
    discountRate: BigNumber.from(0), // A number from 0-1,000,000,000
    ballot: constants.AddressZero,
  })

export const defaultFundingCycleMetadata: SerializedV2V3FundingCycleMetadata =
  serializeV2V3FundingCycleMetadata(
    featureFlagEnabled(FEATURE_FLAGS.V3)
      ? {
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
        }
      : {
          global: {
            allowSetTerminals: false,
            allowSetController: false,
          },
          reservedRate: BigNumber.from(0), // A number from 0-10,000
          redemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
          ballotRedemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
          pausePay: false,
          pauseDistributions: false,
          pauseRedeem: false,
          allowMinting: false,
          pauseBurn: false,
          allowChangeToken: false,
          allowTerminalMigration: false,
          allowControllerMigration: false,
          holdFees: false,
          useTotalOverflowForRedemptions: false,
          useDataSourceForPay: false,
          useDataSourceForRedeem: false,
          dataSource: constants.AddressZero,
        },
  ) ?? {}

const EMPTY_PAYOUT_GROUPED_SPLITS = {
  group: ETH_PAYOUT_SPLIT_GROUP,
  splits: [],
}

const EMPTY_RESERVED_TOKENS_GROUPED_SPLITS = {
  group: RESERVED_TOKEN_SPLIT_GROUP,
  splits: [],
}

const EMPTY_NFT_COLLECTION_METADATA = {
  symbol: undefined,
  name: undefined,
  CID: undefined,
  description: undefined,
}

export const defaultProjectState: V2ProjectState = {
  version: REDUX_STORE_V2_PROJECT_VERSION,
  projectMetadata: { ...defaultProjectMetadataState },
  fundingCycleData: { ...defaultFundingCycleData },
  fundingCycleMetadata: { ...defaultFundingCycleMetadata },
  fundAccessConstraints: [],
  payoutGroupedSplits: EMPTY_PAYOUT_GROUPED_SPLITS,
  payoutsSelection: undefined,
  reservedTokensGroupedSplits: EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
  projectTokensSelection: undefined,
  nftRewards: {
    rewardTiers: [],
    CIDs: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    postPayModal: undefined,
  },
  reconfigurationRuleSelection: undefined,
  fundingCyclesPageSelection: undefined,
  createFurthestPageReached: 'projectDetails',
  createSoftLockPageQueue: [],
}

const editingV2ProjectSlice = createSlice({
  name: 'editingV2Project',
  initialState: defaultProjectState,
  reducers: {
    resetState: () => defaultProjectState,
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
    setAllowMinting: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.allowMinting = action.payload
    },
    setBallot: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.ballot = action.payload
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
    setNftRewardsCollectionMetadataCID: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.nftRewards.collectionMetadata.CID = action.payload
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
    setNftPostPayModalConfig: (
      state,
      action: PayloadAction<NftPostPayModalConfig | undefined>,
    ) => {
      state.nftRewards.postPayModal = action.payload
    },
    setNftRewardsName: (state, action: PayloadAction<string | undefined>) => {
      state.nftRewards.collectionMetadata.name = action.payload
    },
    setAllowSetTerminals: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.global.allowSetTerminals = action.payload
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
    setTokenSettings: (
      state,
      action: PayloadAction<{
        initialMintRate: string
        reservedTokensPercentage: number
        reservedTokenAllocation: AllocationSplit[]
        discountRate: number
        redemptionRate: number
        tokenMinting: boolean
      }>,
    ) => {
      state.fundingCycleData.weight = formatIssuanceRate(
        action.payload.initialMintRate,
      )
      state.fundingCycleMetadata.reservedRate = reservedRateFrom(
        action.payload.reservedTokensPercentage,
      ).toHexString()
      state.reservedTokensGroupedSplits = {
        ...EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
        splits: action.payload.reservedTokenAllocation.map(allocationToSplit),
      }
      state.fundingCycleData.discountRate = discountRateFrom(
        action.payload.discountRate,
      ).toHexString()
      state.fundingCycleMetadata.redemptionRate = redemptionRateFrom(
        action.payload.redemptionRate,
      ).toHexString()
      state.fundingCycleMetadata.allowMinting = action.payload.tokenMinting
    },
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
