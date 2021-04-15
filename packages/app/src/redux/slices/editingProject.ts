import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { constants } from 'ethers'
import { CurrencyOption } from 'models/currencyOption'
import { FundingCycle } from 'models/fundingCycle'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { parsePerMille, parseWad } from 'utils/formatCurrency'
import {
  SerializedFundingCycle,
  serializeFundingCycle,
} from 'utils/serializers'

export type EditingProjectState = {
  projectIdentifier: ProjectIdentifier
  fundingCycle: SerializedFundingCycle
  loading: boolean
}

const defaultDiscountRate = '97'
const defaultFee = '15'
const defaultBondingCurveRate = '318'

export const editingProjectSlice = createSlice({
  name: 'editingProject',
  initialState: {
    projectIdentifier: {
      name: '',
      link: '',
      handle: '',
      logoUri: '',
    },
    fundingCycle: serializeFundingCycle({
      id: BigNumber.from(1),
      projectId: BigNumber.from(0),
      number: BigNumber.from(1),
      previous: BigNumber.from(0),
      target: parseWad('10000'),
      currency: BigNumber.from(1),
      start: BigNumber.from(Math.floor(new Date().valueOf() / 1000)),
      duration: BigNumber.from(
        process.env.NODE_ENV === 'production' ? 30 * SECONDS_IN_DAY : 300,
      ),
      tappedTarget: BigNumber.from(0),
      tappedTotal: BigNumber.from(0),
      reserved: parsePerMille('5'),
      weight: BigNumber.from(0),
      fee: parsePerMille(defaultFee),
      bondingCurveRate: BigNumber.from(defaultBondingCurveRate),
      discountRate: parsePerMille(defaultDiscountRate),
      configured: BigNumber.from(0),
      ballot: constants.AddressZero,
    }),
    loading: false,
  } as EditingProjectState,
  reducers: {
    setProjectIdentifier: (
      state,
      action: PayloadAction<ProjectIdentifier>,
    ) => ({
      ...state,
      projectIdentifier: action.payload,
    }),
    setName: (state, action: PayloadAction<string>) => ({
      ...state,
      projectIdentifier: {
        ...state.projectIdentifier,
        name: action.payload,
      },
    }),
    setLink: (state, action: PayloadAction<string>) => ({
      ...state,
      projectIdentifier: {
        ...state.projectIdentifier,
        link: action.payload,
      },
    }),
    setHandle: (state, action: PayloadAction<string>) => ({
      ...state,
      projectIdentifier: {
        ...state.projectIdentifier,
        handle: action.payload,
      },
    }),
    setLogoUri: (state, action: PayloadAction<string>) => ({
      ...state,
      projectIdentifier: {
        ...state.projectIdentifier,
        logoUri: action.payload,
      },
    }),
    setFundingCycle: (state, action: PayloadAction<FundingCycle>) => ({
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
        currency: action.payload,
      },
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    }),
    setIsRecurring: (state, action: PayloadAction<boolean>) => ({
      ...state,
      fundingCycle: {
        ...state.fundingCycle,
        discountRate: action.payload ? defaultDiscountRate : '0',
      },
    }),
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
