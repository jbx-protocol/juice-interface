import { FormikHelpers } from 'formik'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { useCallback } from 'react'
import * as Yup from 'yup'
import { useProjectDispatch } from '../redux/hooks'
import { projectCartActions } from '../redux/projectCartSlice'
import { useProjectContext } from './useProjectContext'

const PayProjectCardSchema = Yup.object().shape({
  payAmount: Yup.object()
    .shape({
      amount: Yup.number()
        .typeError('Amount is invalid')
        .required('Amount is required'),
      currency: Yup.number<V2V3CurrencyOption>()
        .oneOf([V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD] as const)
        .required(),
    })
    .required(),
})
type PayProjectCardValues = Yup.InferType<typeof PayProjectCardSchema>

export const usePayProjectCard = () => {
  const { fundingCycleMetadata } = useProjectContext()
  const dispatch = useProjectDispatch()
  const addPay = useCallback(
    (
      values: PayProjectCardValues,
      formikHelpers: FormikHelpers<PayProjectCardValues>,
    ) => {
      dispatch(
        projectCartActions.addPayment({
          amount: Number(values.payAmount.amount),
          currency: values.payAmount.currency,
        }),
      )
      formikHelpers.resetForm({
        values: {
          payAmount: {
            amount: undefined as unknown as number,
            currency: values.payAmount.currency,
          },
        },
      })
    },
    [dispatch],
  )

  return {
    addPay,
    validationSchema: PayProjectCardSchema,
    paymentsPaused: fundingCycleMetadata?.pausePay,
  }
}
