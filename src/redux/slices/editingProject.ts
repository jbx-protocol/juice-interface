import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { ProjectTagName } from 'models/project-tags'
import {
  LATEST_METADATA_VERSION,
  ProjectMetadata,
} from 'models/projectMetadata'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod, TicketMod } from 'models/v1/mods'
import { toDateSeconds } from 'utils/format/formatDate'
import {
  perbicentToPercent,
  percentToPerbicent,
  percentToPermille,
  permilleToPercent,
} from 'utils/format/formatNumber'
import {
  SerializedV1FundingCycle,
  serializeV1FundingCycle,
} from 'utils/v1/serializers'

interface EditingProjectInfo {
  metadata: ProjectMetadata
  handle: string
}

interface EditingProjectState {
  version: number
  info: EditingProjectInfo
  fundingCycle: SerializedV1FundingCycle
  payoutMods: PayoutMod[]
  ticketMods: TicketMod[]
}

// Increment this version by 1 when making breaking changes.
// When users return to the site and their local version is less than
// this number, their state will be reset.
export const REDUX_STORE_V1_PROJECT_VERSION = 1

const defaultDiscountRate = percentToPermille(0)
const defaultBondingCurveRate = percentToPerbicent(100)

export const defaultProjectState: EditingProjectState = {
  version: REDUX_STORE_V1_PROJECT_VERSION,
  info: {
    metadata: {
      name: '',
      infoUri: '',
      logoUri: '',
      description: '',
      twitter: '',
      discord: '',
      telegram: '',
      tokens: [],
      version: LATEST_METADATA_VERSION,
      archived: false,
      tags: [],
    },
    handle: '',
  },
  fundingCycle: serializeV1FundingCycle({
    id: BigNumber.from(1),
    projectId: BigNumber.from(0),
    number: BigNumber.from(1),
    basedOn: BigNumber.from(0),
    target: constants.MaxUint256,
    currency: BigNumber.from(V1_CURRENCY_USD),
    start: BigNumber.from(toDateSeconds(new Date())),
    duration: BigNumber.from(0),
    tapped: BigNumber.from(0),
    weight: constants.WeiPerEther.mul(1000000), // 1e24
    fee: BigNumber.from(0),
    reserved: percentToPerbicent(0),
    bondingCurveRate: defaultBondingCurveRate,
    discountRate: defaultDiscountRate,
    cycleLimit: BigNumber.from(0),
    configured: BigNumber.from(0),
    ballot: constants.AddressZero,
    payIsPaused: false,
    ticketPrintingIsAllowed: false,
    treasuryExtension: constants.AddressZero,
  }),
  payoutMods: [],
  ticketMods: [],
}

const editingProjectSlice = createSlice({
  name: 'editingProject',
  initialState: defaultProjectState,
  reducers: {
    resetState: () => defaultProjectState,
    setProjectInfo: (state, action: PayloadAction<EditingProjectInfo>) => {
      state.info = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.info.metadata.name = action.payload
    },
    setInfoUri: (state, action: PayloadAction<string>) => {
      state.info.metadata.infoUri = action.payload
    },
    setLogoUri: (state, action: PayloadAction<string>) => {
      state.info.metadata.logoUri = action.payload
    },
    setTwitter: (state, action: PayloadAction<string>) => {
      state.info.metadata.twitter = action.payload
    },
    setDiscord: (state, action: PayloadAction<string>) => {
      state.info.metadata.discord = action.payload
    },
    setTelegram: (state, action: PayloadAction<string>) => {
      state.info.metadata.telegram = action.payload
    },
    setPayButton: (state, action: PayloadAction<string>) => {
      state.info.metadata.payButton = action.payload
    },
    setPayDisclosure: (state, action: PayloadAction<string>) => {
      state.info.metadata.payDisclosure = action.payload
    },
    setTags: (state, action: PayloadAction<ProjectTagName[]>) => {
      state.info.metadata.tags = action.payload
    },
    setHandle: (state, action: PayloadAction<string>) => {
      state.info.handle = action.payload
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.info.metadata.description = action.payload
    },
    setFundingCycle: (
      state,
      action: PayloadAction<SerializedV1FundingCycle>,
    ) => {
      state.fundingCycle = action.payload
    },
    setId: (state, action: PayloadAction<string>) => {
      state.fundingCycle.id = action.payload
    },
    setProjectId: (state, action: PayloadAction<string>) => {
      state.fundingCycle.projectId = action.payload
    },
    setNumber: (state, action: PayloadAction<string>) => {
      state.fundingCycle.number = action.payload
    },
    setTarget: (state, action: PayloadAction<string>) => {
      state.fundingCycle.target = action.payload
    },
    setFee: (state, action: PayloadAction<string>) => {
      state.fundingCycle.fee = action.payload
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.fundingCycle.duration = action.payload
    },
    setFundingCycleStart: (state, action: PayloadAction<string>) => {
      state.fundingCycle.start = action.payload
    },
    setReserved: (state, action: PayloadAction<string>) => {
      state.fundingCycle.reserved = action.payload
    },
    setDiscountRate: (state, action: PayloadAction<string>) => {
      state.fundingCycle.discountRate = action.payload
    },
    setBondingCurveRate: (state, action: PayloadAction<string>) => {
      state.fundingCycle.bondingCurveRate = action.payload
    },
    setCurrency: (state, action: PayloadAction<V1CurrencyOption>) => {
      state.fundingCycle.currency = action.payload.toString()
    },
    setBallot: (state, action: PayloadAction<string>) => {
      state.fundingCycle.ballot = action.payload
    },
    setIsRecurring: (state, action: PayloadAction<boolean>) => {
      state.fundingCycle.discountRate = permilleToPercent(
        action.payload ? defaultDiscountRate : '201',
      )
      state.fundingCycle.bondingCurveRate = perbicentToPercent(
        action.payload ? defaultBondingCurveRate : 0,
      )
    },
    setPayIsPaused: (state, action: PayloadAction<boolean>) => {
      state.fundingCycle.payIsPaused = action.payload
    },
    setTicketPrintingIsAllowed: (state, action: PayloadAction<boolean>) => {
      state.fundingCycle.ticketPrintingIsAllowed = action.payload
    },
    setPayoutMods: (state, action: PayloadAction<PayoutMod[]>) => {
      state.payoutMods = action.payload
    },
    setTicketMods: (state, action: PayloadAction<TicketMod[]>) => {
      state.ticketMods = action.payload
    },
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
