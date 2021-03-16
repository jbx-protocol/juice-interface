import { BigNumber } from '@ethersproject/bignumber'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { emptyAddress } from 'constants/empty-address'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { parsePerMille, parseWad } from 'utils/formatCurrency'
import { serializeBudget, SerializedBudget } from 'utils/serializers'

export type EditingBudgetState = { value: SerializedBudget; loading: boolean }

export const editingBudgetSlice = createSlice({
  name: 'editingBudget',
  initialState: {
    value: serializeBudget({
      id: BigNumber.from(1),
      project: '',
      number: BigNumber.from(1),
      previous: BigNumber.from(0),
      name: '',
      link: '',
      target: BigNumber.from(0),
      currency: BigNumber.from(1),
      total: parseWad('0'),
      start: BigNumber.from(Math.floor(new Date().valueOf() / 1000)),
      duration: BigNumber.from(
        process.env.NODE_ENV === 'production' ? 30 * SECONDS_IN_DAY : '300',
      ),
      tappedTarget: BigNumber.from(0),
      tappedTotal: BigNumber.from(0),
      donationAmount: parsePerMille('0'),
      donationRecipient: emptyAddress,
      reserved: parsePerMille('0'),
      weight: BigNumber.from(0),
      discountRate: parsePerMille('97'),
      configured: BigNumber.from(0),
    }),
    loading: false,
  } as EditingBudgetState,
  reducers: {
    set: (state, action: PayloadAction<Budget>) => ({
      ...state,
      value: serializeBudget(action.payload) ?? state.value,
    }),
    setProject: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        project: action.payload,
      } as SerializedBudget,
    }),
    setName: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        name: action.payload,
      },
    }),
    setLink: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        link: action.payload,
      },
    }),
    setTarget: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        target: action.payload,
      },
    }),
    setDuration: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        duration: action.payload,
      },
    }),
    setP: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        p: action.payload,
      },
    }),
    setB: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        b: action.payload,
      },
    }),
    setBAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        bAddress: action.payload,
      },
    }),
    setDiscountRate: (state, action: PayloadAction<string>) => ({
      ...state,
      value: {
        ...state.value,
        discountRate: action.payload,
      },
    }),
    setCurrency: (state, action: PayloadAction<BudgetCurrency>) => ({
      ...state,
      value: {
        ...state.value,
        currency: action.payload,
      },
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    }),
  },
})

export const editingBudgetActions = editingBudgetSlice.actions

export default editingBudgetSlice.reducer
