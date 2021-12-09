import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { PayoutMod, TicketMod } from 'models/mods'
import { ProjectMetadataV3 } from 'models/project-metadata'
import {
  fromPerbicent,
  fromPermille,
  parsePerbicent,
  parsePermille,
} from 'utils/formatNumber'
import {
  SerializedFundingCycle,
  serializeFundingCycle,
} from 'utils/serializers'

type EditingProjectInfo = {
  metadata: ProjectMetadataV3
  handle: string
}

export type EditingProjectState = {
  info: EditingProjectInfo
  fundingCycle: SerializedFundingCycle
  payoutMods: PayoutMod[]
  ticketMods: TicketMod[]
}

const defaultDiscountRate = parsePermille(0)
const defaultBondingCurveRate = parsePerbicent(100)

export const defaultProjectState: EditingProjectState = {
  info: {
    metadata: {
      name: '',
      infoUri: '',
      logoUri: '',
      description: '',
      twitter: '',
      discord: '',
      tokens: [],
      version: 3,
    },
    handle: '',
  },
  fundingCycle: serializeFundingCycle({
    id: BigNumber.from(1),
    projectId: BigNumber.from(0),
    number: BigNumber.from(1),
    basedOn: BigNumber.from(0),
    target: constants.MaxUint256,
    currency: BigNumber.from(1),
    start: BigNumber.from(Math.floor(new Date().valueOf() / 1000)),
    duration: BigNumber.from(0),
    tapped: BigNumber.from(0),
    weight: BigNumber.from('1000000000000000000000000'), // 1e24
    fee: BigNumber.from(0),
    reserved: parsePerbicent(0),
    bondingCurveRate: defaultBondingCurveRate,
    discountRate: defaultDiscountRate,
    cycleLimit: BigNumber.from(0),
    configured: BigNumber.from(0),
    ballot: constants.AddressZero,
    payIsPaused: false,
    printingTicketsIsAllowed: false,
  }),
  payoutMods: [],
  ticketMods: [],
}

export const editingProjectSlice = createSlice({
  name: 'editingProject',
  initialState: defaultProjectState,
  reducers: {
    setState: (state, action: PayloadAction<EditingProjectState>) =>
      action.payload,
    resetState: (state, action: PayloadAction) => defaultProjectState,
    setProjectInfo: (state, action: PayloadAction<EditingProjectInfo>) => ({
      ...state,
      info: action.payload,
    }),
    setName: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          name: action.payload,
        },
      },
    }),
    setInfoUri: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          infoUri: action.payload,
        },
      },
    }),
    setLogoUri: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          logoUri: action.payload,
        },
      },
    }),
    setTwitter: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          twitter: action.payload,
        },
      },
    }),
    setDiscord: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          discord: action.payload,
        },
      },
    }),
    setPayButton: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          payButton: action.payload,
        },
      },
    }),
    setPayDisclosure: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          payDisclosure: action.payload,
        },
      },
    }),
    setHandle: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        handle: action.payload,
      },
    }),
    setDescription: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        metadata: {
          ...state.info.metadata,
          description: action.payload,
        },
      },
    }),
    setFundingCycle: (
      state,
      action: PayloadAction<SerializedFundingCycle>,
    ) => ({
      ...state,
      fundingCycle: action.payload,
    }),
    setId: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        id: action.payload,
      },
    }),
    setProjectId: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        projectId: action.payload,
      },
    }),
    setNumber: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        number: action.payload,
      },
    }),
    setTarget: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        target: action.payload,
      },
    }),
    setFee: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        fee: action.payload,
      },
    }),
    setDuration: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        duration: action.payload,
      },
    }),
    setReserved: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        reserved: action.payload,
      },
    }),
    setDiscountRate: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        discountRate: action.payload,
      },
    }),
    setBondingCurveRate: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        bondingCurveRate: action.payload,
      },
    }),
    setCurrency: (state, action: PayloadAction<CurrencyOption>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        currency: action.payload.toString(),
      },
    }),
    setBallot: (state, action: PayloadAction<string>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        ballot: action.payload,
      },
    }),
    setIsRecurring: (state, action: PayloadAction<boolean>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        discountRate: fromPermille(
          action.payload ? defaultDiscountRate : '201',
        ),
        bondingCurveRate: fromPerbicent(
          action.payload ? defaultBondingCurveRate : 0,
        ),
      },
    }),
    setPayIsPaused: (state, action: PayloadAction<boolean>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        payIsPaused: action.payload,
      },
    }),
    setPrintingTicketsIsAllowed: (state, action: PayloadAction<boolean>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        printingTicketsIsAllowed: action.payload,
      },
    }),
    setPayoutMods: (state, action: PayloadAction<PayoutMod[]>) => ({
      ...state,
      payoutMods: action.payload,
    }),
    setTicketMods: (state, action: PayloadAction<TicketMod[]>) => ({
      ...state,
      ticketMods: action.payload,
    }),
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
