import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SECONDS_IN_DAY } from 'constants/units'
import { constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { ProjectMetadata } from 'models/project-metadata'
import { parsePerbicent, parseWad } from 'utils/formatNumber'
import {
  EditingFundingCycle,
  SerializedFundingCycle,
  serializeFundingCycle,
} from 'utils/serializers'

type EditingProjectInfo = {
  metadata: ProjectMetadata
  handle: string
}

export type EditingProjectState = {
  info: EditingProjectInfo
  fundingCycle: SerializedFundingCycle
}

const defaultDiscountRate = parsePerbicent('97')
const defaultBondingCurveRate = parsePerbicent('50')

export const editingProjectSlice = createSlice({
  name: 'editingProject',
  initialState: {
    info: {
      metadata: {
        name: '',
        infoUri: '',
        logoUri: '',
      },
      handle: '',
    },
    fundingCycle: serializeFundingCycle({
      id: BigNumber.from(1),
      projectId: BigNumber.from(0),
      number: BigNumber.from(1),
      previous: BigNumber.from(0),
      target: parseWad('10000'),
      currency: 1,
      start: Math.floor(new Date().valueOf() / 1000),
      duration: 30 * SECONDS_IN_DAY,
      tapped: BigNumber.from(0),
      weight: BigNumber.from(0),
      fee: 15,
      reserved: 50,
      bondingCurveRate: defaultBondingCurveRate.toNumber(),
      discountRate: defaultDiscountRate.toNumber(),
      configured: 0,
      ballot: constants.AddressZero,
    }),
  } as EditingProjectState,
  reducers: {
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
    setHandle: (state, action: PayloadAction<string>) => ({
      ...state,
      info: {
        ...state.info,
        handle: action.payload,
      },
    }),
    setFundingCycle: (state, action: PayloadAction<EditingFundingCycle>) => ({
      ...state,
      fundingCycle: serializeFundingCycle(action.payload),
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
    setIsRecurring: (state, action: PayloadAction<boolean>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        discountRate: action.payload ? defaultDiscountRate.toString() : '0',
        bondingCurveRate: action.payload
          ? defaultBondingCurveRate.toString()
          : '0',
      },
    }),
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
