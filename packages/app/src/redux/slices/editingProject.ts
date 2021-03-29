import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { emptyAddress } from 'constants/empty-address'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { parsePerMille, parseWad } from 'utils/formatCurrency'
import { serializeBudget, SerializedBudget } from 'utils/serializers'

export type EditingProjectState = {
  projectIdentifier: ProjectIdentifier
  budget: SerializedBudget
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
    budget: serializeBudget({
      id: BigNumber.from(1),
      projectId: BigNumber.from(0),
      number: BigNumber.from(1),
      previous: BigNumber.from(0),
      target: parseWad('10000'),
      currency: BigNumber.from(1),
      total: parseWad('0'),
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
      ballot: emptyAddress,
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
    logoUri: (state, action: PayloadAction<string>) => ({
      ...state,
      projectIdentifier: {
        ...state.projectIdentifier,
        logoUri: action.payload,
      },
    }),
    setBudget: (state, action: PayloadAction<Budget>) => ({
      ...state,
      budget: serializeBudget(action.payload),
    }),
    setId: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        id: action.payload,
      },
    }),
    setProjectId: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        projectId: action.payload,
      },
    }),
    setNumber: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        number: action.payload,
      },
    }),
    setTarget: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        target: action.payload,
      },
    }),
    setDuration: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        duration: action.payload,
      },
    }),
    setReserved: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        reserved: action.payload,
      },
    }),
    setDiscountRate: (state, action: PayloadAction<string>) => ({
      ...state,
      budget: {
        ...state.budget,
        discountRate: action.payload,
      },
    }),
    setCurrency: (state, action: PayloadAction<BudgetCurrency>) => ({
      ...state,
      budget: {
        ...state.budget,
        currency: action.payload,
      },
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    }),
    setIsRecurring: (state, action: PayloadAction<boolean>) => ({
      ...state,
      budget: {
        ...state.budget,
        discountRate: action.payload ? defaultDiscountRate : '0',
      },
    }),
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
