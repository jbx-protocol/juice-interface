/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'
import { FormikHelpers } from 'formik'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import * as PayProjectCardModule from './usePayProjectCard'
import { useProjectCart } from './useProjectCart'

jest.mock('./useProjectCart')

type PayProjectCardValues = {
  payAmount: {
    amount: number
    currency: V2V3CurrencyOption
  }
}

describe('usePayProjectCard', () => {
  let formikHelpers: FormikHelpers<PayProjectCardValues>
  let values: PayProjectCardValues
  let dispatch: jest.Mock

  beforeEach(() => {
    dispatch = jest.fn()
    ;(useProjectCart as jest.Mock).mockReturnValue({ dispatch })
    formikHelpers = {
      resetForm: jest.fn(),
    } as any
    values = {
      payAmount: {
        amount: 100,
        currency: V2V3_CURRENCY_ETH,
      },
    }
  })

  it('returns a function to add a payment and a validation schema', () => {
    const { result } = renderHook(() =>
      PayProjectCardModule.usePayProjectCard(),
    )
    expect(result.current).toHaveProperty('addPay')
    expect(result.current).toHaveProperty('validationSchema')
  })

  it('dispatches an action to add a payment when addPay is called', () => {
    const { result } = renderHook(() =>
      PayProjectCardModule.usePayProjectCard(),
    )
    act(() => result.current.addPay(values, formikHelpers))
    expect(dispatch).toHaveBeenCalledWith({
      type: 'addPayment',
      payload: {
        amount: values.payAmount.amount,
        currency: values.payAmount.currency,
      },
    })
  })

  it('resets the form with the original currency and undefined amount when addPay is called', () => {
    const { result } = renderHook(() =>
      PayProjectCardModule.usePayProjectCard(),
    )
    act(() => result.current.addPay(values, formikHelpers))
    expect(formikHelpers.resetForm).toHaveBeenCalledWith({
      values: {
        payAmount: {
          amount: undefined,
          currency: values.payAmount.currency,
        },
      },
    })
  })
})
