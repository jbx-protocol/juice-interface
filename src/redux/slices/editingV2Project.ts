import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@ethersproject/constants'
import { ProjectMetadataV3 } from 'models/project-metadata'
import {
  V2FundAccessConstraints,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { Split } from 'models/v2/splits'

export interface EditingV2ProjectState {
  version: number
  projectMetadata: ProjectMetadataV3
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraints[]
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

const defaultFundingCycleData: V2FundingCycleData = {
  duration: BigNumber.from(0),
  weight: BigNumber.from('1' + '0'.repeat(18)), // 1,000,000 of your project's tokens will be minted per ETH received
  discountRate: BigNumber.from(0),
  ballot: constants.AddressZero,
}

const defaultFundingCycleMetadata: V2FundingCycleMetadata = {
  reservedRate: BigNumber.from(0),
  redemptionRate: BigNumber.from(0),
  ballotRedemptionRate: BigNumber.from(0),
  pausePay: BigNumber.from(0),
  pauseDistributions: BigNumber.from(0),
  pauseRedeem: BigNumber.from(0),
  pauseMint: BigNumber.from(0),
  pauseBurn: BigNumber.from(0),
  allowTerminalMigration: BigNumber.from(0),
  allowControllerMigration: BigNumber.from(0),
  holdFees: BigNumber.from(0),
  useLocalBalanceForRedemptions: BigNumber.from(0),
  useDataSourceForPay: BigNumber.from(0),
  useDataSourceForRedeem: BigNumber.from(0),
  dataSource: constants.AddressZero,
}

export const defaultProjectState: EditingV2ProjectState = {
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
    setState: (state, action: PayloadAction<EditingV2ProjectState>) =>
      action.payload,
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
  },
})

export const editingV2ProjectActions = editingV2ProjectSlice.actions

export default editingV2ProjectSlice.reducer
