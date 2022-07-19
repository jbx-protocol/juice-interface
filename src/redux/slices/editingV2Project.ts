import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@ethersproject/constants'

import { ProjectMetadataV4 } from 'models/project-metadata'

import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
  Split,
} from 'models/v2/splits'
import {
  serializeV2FundingCycleData,
  serializeV2FundingCycleMetadata,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  SerializedV2FundAccessConstraint,
} from 'utils/v2/serializers'

import {
  DEFAULT_MINT_RATE,
  issuanceRateFrom,
  redemptionRateFrom,
} from 'utils/v2/math'
import { NftRewardTier } from 'models/v2/nftRewardTier'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { DEFAULT_BALLOT_STRATEGY } from 'constants/v2/ballotStrategies'

interface V2ProjectState {
  version: number
  projectMetadata: ProjectMetadataV4
  fundingCycleData: SerializedV2FundingCycleData
  fundingCycleMetadata: SerializedV2FundingCycleMetadata
  fundAccessConstraints: SerializedV2FundAccessConstraint[]
  payoutGroupedSplits: ETHPayoutGroupedSplits
  reservedTokensGroupedSplits: ReservedTokensGroupedSplits
  nftRewardTiers: NftRewardTier[]
  nftRewardsCIDs: string[] | undefined // points to locations of the NFTs' json on IPFS
}

// Increment this version by 1 when making breaking changes.
// When users return to the site and their local version is less than
// this number, their state will be reset.
export const REDUX_STORE_V2_PROJECT_VERSION = 4

const defaultProjectMetadataState: ProjectMetadataV4 = {
  name: '',
  infoUri: '',
  logoUri: '',
  description: '',
  twitter: '',
  discord: '',
  tokens: [],
  version: 4,
}

export const defaultFundingCycleData: SerializedV2FundingCycleData =
  serializeV2FundingCycleData({
    duration: BigNumber.from(0),
    weight: BigNumber.from(issuanceRateFrom(DEFAULT_MINT_RATE.toString())), // 1e24, resulting in 1,000,000 tokens per ETH
    discountRate: BigNumber.from(0), // A number from 0-1,000,000,000
    ballot: DEFAULT_BALLOT_STRATEGY.address,
  })

export const defaultFundingCycleMetadata: SerializedV2FundingCycleMetadata =
  serializeV2FundingCycleMetadata({
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
    useDataSourceForPay: true,
    useDataSourceForRedeem: false,
    dataSource: constants.AddressZero,
  })

const EMPTY_PAYOUT_GROUPED_SPLITS = {
  group: ETH_PAYOUT_SPLIT_GROUP,
  splits: [],
}

const EMPTY_RESERVED_TOKENS_GROUPED_SPLITS = {
  group: RESERVED_TOKEN_SPLIT_GROUP,
  splits: [],
}

export const defaultProjectState: V2ProjectState = {
  version: REDUX_STORE_V2_PROJECT_VERSION,
  projectMetadata: { ...defaultProjectMetadataState },
  fundingCycleData: { ...defaultFundingCycleData },
  fundingCycleMetadata: { ...defaultFundingCycleMetadata },
  fundAccessConstraints: [],
  payoutGroupedSplits: EMPTY_PAYOUT_GROUPED_SPLITS,
  reservedTokensGroupedSplits: EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
  nftRewardTiers: [],
  nftRewardsCIDs: undefined,
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
      action: PayloadAction<SerializedV2FundingCycleData>,
    ) => {
      state.fundingCycleData = action.payload
    },
    setFundingCycleMetadata: (
      state,
      action: PayloadAction<SerializedV2FundingCycleMetadata>,
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
      action: PayloadAction<SerializedV2FundAccessConstraint[]>,
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
    setReservedTokensSplits: (state, action: PayloadAction<Split[]>) => {
      state.reservedTokensGroupedSplits = {
        ...EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
        splits: action.payload,
      }
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
      state.nftRewardTiers = action.payload
    },
    setNftRewardsCIDs: (state, action: PayloadAction<string[]>) => {
      state.nftRewardsCIDs = action.payload
    },
    setAllowSetTerminals: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.global.allowSetTerminals = action.payload
    },
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
