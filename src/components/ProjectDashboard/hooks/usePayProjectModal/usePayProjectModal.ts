import { useDelegateMetadata } from 'components/v2v3/V2V3Project/V2V3PayButton/V2V3ConfirmPayModal/hooks/useDelegateMetadata.tsx'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useCallback, useMemo, useReducer } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import * as Yup from 'yup'
import { useProjectCart } from '../useProjectCart'
import { useProjectMetadata } from '../useProjectMetadata'
import { payProjectModalReducer } from './payProjectModalReducer'

const ValidationSchema = Yup.object().shape({
  message: Yup.object().shape({
    messageString: Yup.string().max(256, 'Message is too long'),
    attachedUrl: Yup.string().url('Invalid URL'),
  }),
  userAcceptsTerms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions',
  ),
  beneficiaryAddress: Yup.string(),
})
export type PayProjectModalFormValues = Yup.InferType<typeof ValidationSchema>

export const usePayProjectModal = () => {
  const {
    dispatch: cartDispatch,
    payModalOpen,
    totalAmount,
    nftRewards,
  } = useProjectCart()
  const { projectMetadata } = useProjectMetadata()
  const { name, payDisclosure } = projectMetadata ?? {}
  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()
  const [modalState, modalDispatch] = useReducer(payProjectModalReducer, {
    isTransactionPending: false,
    isTransactionConfirmed: false,
    transactionError: undefined,
  })

  // const payProjectTx = usePayETHPaymentTerminalTx()
  const delegateMetadata = useDelegateMetadata()

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      cartDispatch({ type: 'setPayModal', payload: { open } })
    },
    [cartDispatch],
  )

  const primaryAmount = useMemo(() => {
    if (!totalAmount)
      return formatCurrencyAmount({ amount: 0, currency: V2V3_CURRENCY_ETH })
    return formatCurrencyAmount(totalAmount)
  }, [totalAmount])

  const secondaryAmount = useMemo(() => {
    if (!totalAmount) return undefined
    if (totalAmount.currency === V2V3_CURRENCY_ETH) {
      const amount = Number(converter.weiToUsd(parseWad(totalAmount.amount)))
      return formatCurrencyAmount({
        amount,
        currency: V2V3_CURRENCY_USD,
      })
    }
    return formatCurrencyAmount({
      amount: fromWad(converter.usdToWei(totalAmount.amount)),
      currency: V2V3_CURRENCY_ETH,
    })
  }, [converter, totalAmount])

  const onPaySubmit = useCallback(
    async (
      values: PayProjectModalFormValues,
      formikHelpers: FormikHelpers<PayProjectModalFormValues>,
    ) => {
      if (!values.userAcceptsTerms) return
      const { messageString, attachedUrl } = values.message
      const memo = buildPaymentMemo({
        text: messageString,
        imageUrl: attachedUrl,
        // nftUrls: // TODO
      })
      const beneficiary = values.beneficiaryAddress ?? userAddress

      let weiAmount
      if (!totalAmount) {
        weiAmount = parseWad(0)
      } else if (totalAmount.currency === V2V3_CURRENCY_ETH) {
        weiAmount = parseWad(totalAmount.amount)
      } else {
        weiAmount = converter.usdToWei(totalAmount.amount)
      }
      console.info('payProjectTx', {
        memo,
        beneficiary,
        delegateMetadata,
        value: weiAmount,
        preferClaimedTokens: true, // TODO: Do we need an option for this?
      })

      // simulate metamask
      await new Promise(resolve =>
        setTimeout(() => {
          console.info('transaction pending')
          modalDispatch({ type: 'transactionPending' })
          resolve(undefined)
        }, 2000),
      )

      await new Promise(resolve =>
        setTimeout(() => {
          console.info('transaction confirmed')
          modalDispatch({ type: 'transactionConfirmed' })
          resolve(undefined)
        }, 2000),
      )

      // try {
      //   const txSuccess = await payProjectTx(
      //     {
      //       memo,
      //       beneficiary,
      //       delegateMetadata,
      //       value: weiAmount,
      //       preferClaimedTokens: true, // TODO: Do we need an option for this?
      //     },
      //     {
      //       onConfirmed() {
      //         // handle success
      //       },
      //       onError() {
      //         // handle error
      //       },
      //       onDone() {
      //         // transaction pending
      //       },
      //     },
      //   )
      //   if (!txSuccess) {
      //     // undo transaction state
      //   }
      // } catch (e) {
      //   emitErrorNotification(`Failure: ${e}`)
      //   // todo state
      // }

      setOpen(false)
      modalDispatch({ type: 'reset' })
      formikHelpers.resetForm()
      formikHelpers.setSubmitting(false)
    },
    [converter, delegateMetadata, setOpen, totalAmount, userAddress],
  )

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    nftRewards,
    validationSchema: ValidationSchema,
    projectName: name,
    projectPayDisclosure: payDisclosure,
    ...modalState,
    setOpen,
    onPaySubmit,
  }
}
