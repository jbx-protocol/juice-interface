import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@ethersproject/constants'

import { ProjectMetadataV4 } from 'models/project-metadata'

import {
  ETHPayoutGroupedSplits,
  ReserveTokenGroupedSplits,
  Split,
} from 'models/v2/splits'
import {
  serializeV2FundingCycleData,
  serializeV2FundingCycleMetadata,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  SerializedV2FundAccessConstraint,
} from 'utils/v2/serializers'
import { percentToPermyriad } from 'utils/formatNumber'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVE_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { DEFAULT_BALLOT_STRATEGY } from 'constants/ballotStrategies/ballotStrategies'

export interface V2ProjectState {
  version: number
  projectMetadata: ProjectMetadataV4
  fundingCycleData: SerializedV2FundingCycleData
  fundingCycleMetadata: SerializedV2FundingCycleMetadata
  fundAccessConstraints: SerializedV2FundAccessConstraint[]
  payoutGroupedSplits: ETHPayoutGroupedSplits
  reserveTokenGroupedSplits: ReserveTokenGroupedSplits
}

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

const defaultFundingCycleData: SerializedV2FundingCycleData =
  serializeV2FundingCycleData({
    duration: BigNumber.from(0),
    weight: constants.WeiPerEther.mul(1000000), // 1e24, resulting in 1,000,000 tokens per ETH
    discountRate: BigNumber.from(0), // A number from 0-1,000,000,000
    ballot: DEFAULT_BALLOT_STRATEGY.address,
  })

const defaultFundingCycleMetadata: SerializedV2FundingCycleMetadata =
  serializeV2FundingCycleMetadata({
    reservedRate: BigNumber.from(0), // A number from 0-10,000
    redemptionRate: percentToPermyriad(100), // A number from 0-10,000
    ballotRedemptionRate: BigNumber.from(0), // A number from 0-10,000
    pausePay: false,
    pauseDistributions: false,
    pauseRedeem: false,
    pauseMint: false,
    pauseBurn: false,
    allowChangeToken: false,
    allowTerminalMigration: false,
    allowControllerMigration: false,
    holdFees: false,
    useLocalBalanceForRedemptions: false,
    useDataSourceForPay: false,
    useDataSourceForRedeem: false,
    dataSource: constants.AddressZero,
  })

export const defaultProjectState: V2ProjectState = {
  // Increment this version by 1 when making breaking changes.
  // When users return to the site and their local version is less than
  // this number, their state will be reset.
  version: 1,
  projectMetadata: { ...defaultProjectMetadataState },
  fundingCycleData: { ...defaultFundingCycleData },
  fundingCycleMetadata: { ...defaultFundingCycleMetadata },
  fundAccessConstraints: [],
  payoutGroupedSplits: {
    group: ETH_PAYOUT_SPLIT_GROUP,
    splits: [],
  },
  reserveTokenGroupedSplits: {
    group: RESERVE_TOKEN_SPLIT_GROUP,
    splits: [],
  },
}

export const editingV2ProjectSlice = createSlice({
  name: 'editingV2Project',
  initialState: defaultProjectState,
  reducers: {
    setState: (state, action: PayloadAction<V2ProjectState>) => action.payload,
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
    setPayoutSplits: (state, action: PayloadAction<Split[]>) => {
      state.payoutGroupedSplits.splits = action.payload
    },
    setReserveTokenSplits: (state, action: PayloadAction<Split[]>) => {
      state.reserveTokenGroupedSplits.splits = action.payload
    },
    setPausePay: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.pausePay = action.payload
    },
    setPauseMint: (state, action: PayloadAction<boolean>) => {
      state.fundingCycleMetadata.pauseMint = action.payload
    },
    setBallot: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.ballot = action.payload
    },
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
