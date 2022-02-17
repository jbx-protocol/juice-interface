import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@ethersproject/constants'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { V2FundAccessConstraint } from 'models/v2/fundingCycle'

import { Split } from 'models/v2/splits'
import {
  serializeV2FundingCycleData,
  serializeV2FundingCycleMetadata,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  SerializedV2FundAccessConstraint,
} from 'utils/v2/serializers'

export interface EditingV2ProjectState {
  version: number
  projectMetadata?: ProjectMetadataV3
  fundingCycleData?: SerializedV2FundingCycleData
  fundingCycleMetadata?: SerializedV2FundingCycleMetadata
  fundAccessConstraints?: V2FundAccessConstraint[]
  payoutSplits?: Split[]
  reserveTokenSplits?: Split[]
}

export interface V2ProjectState {
  version: number
  projectMetadata: ProjectMetadataV3
  fundingCycleData: SerializedV2FundingCycleData
  fundingCycleMetadata: SerializedV2FundingCycleMetadata
  fundAccessConstraints: SerializedV2FundAccessConstraint[]
  payoutSplits: Split[]
  reserveTokenSplits: Split[]
}

const defaultProjectMetadataState: ProjectMetadataV3 = {
  name: '',
  infoUri: '',
  logoUri: '',
  description: '',
  twitter: '',
  discord: '',
  tokens: [],
  version: 3,
}

const defaultFundingCycleData: SerializedV2FundingCycleData =
  serializeV2FundingCycleData({
    duration: BigNumber.from(0),
    weight: BigNumber.from('1' + '0'.repeat(18)), // 1,000,000 of your project's tokens will be minted per ETH received
    discountRate: BigNumber.from(0),
    ballot: constants.AddressZero,
  })

const defaultFundingCycleMetadata: SerializedV2FundingCycleMetadata =
  serializeV2FundingCycleMetadata({
    reservedRate: BigNumber.from(0),
    redemptionRate: BigNumber.from(0),
    ballotRedemptionRate: BigNumber.from(0),
    pausePay: false,
    pauseDistributions: false,
    pauseRedeem: false,
    pauseMint: false,
    pauseBurn: false,
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
  payoutSplits: [],
  reserveTokenSplits: [],
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
    setDuration: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.duration = action.payload
    },
    setDiscountRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleData.discountRate = action.payload
    },
    setReservedRate: (state, action: PayloadAction<string>) => {
      state.fundingCycleMetadata.reservedRate = action.payload
    },
    setFundAccessConstraints: (
      state,
      action: PayloadAction<SerializedV2FundAccessConstraint[]>,
    ) => {
      state.fundAccessConstraints = action.payload
    },
    setPayoutSplits: (state, action: PayloadAction<Split[]>) => {
      state.payoutSplits = action.payload
    },
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
