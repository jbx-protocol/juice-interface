import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useJBWallet } from 'hooks/Wallet/useJBWallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { TxStatus } from 'models/transaction'
import { useCallback, useContext, useMemo, useReducer } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import * as Yup from 'yup'
import { useProjectCart } from '../useProjectCart'
import { useProjectMetadata } from '../useProjectMetadata'
import { useProjectPageQueries } from '../useProjectPageQueries'
import { payProjectModalReducer } from './payProjectModalReducer'
import { usePayProjectTx } from './usePayProjectTx'

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
  const { userAddress } = useJBWallet()
  const converter = useCurrencyConverter()
  const [modalState, modalDispatch] = useReducer(payProjectModalReducer, {
    isTransactionPending: false,
    isTransactionConfirmed: false,
    transactionError: undefined,
  })
  const { setProjectPayReceipt } = useProjectPageQueries()
  const { transactions } = useContext(TxHistoryContext)

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      cartDispatch({ type: 'setPayModal', payload: { open } })
    },
    [cartDispatch],
  )

  const onPaySubmit = usePayProjectTx({
    onTransactionPending: () => {
      modalDispatch({ type: 'transactionPending' })
    },
    onTransactionConfirmed: (payReceipt, formikHelpers) => {
      setProjectPayReceipt(payReceipt)
      setOpen(false)
      cartDispatch({ type: 'payProject' })
      setTimeout(() => {
        formikHelpers.setSubmitting(false)
        formikHelpers.resetForm()
        modalDispatch({ type: 'reset' })
      }, 300)
    },
    onTransactionError: (error: Error, formikHelpers) => {
      emitErrorNotification(error.message)
      modalDispatch({ type: 'reset' })
      formikHelpers.setSubmitting(false)
    },
  })

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

  const pendingTransactionHash = useMemo(() => {
    const pendingTransaction = transactions?.find(
      tx => tx.status === TxStatus.pending,
    )
    return pendingTransaction?.tx?.hash
  }, [transactions])

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    nftRewards,
    validationSchema: ValidationSchema,
    projectName: name,
    projectPayDisclosure: payDisclosure,
    pendingTransactionHash,
    ...modalState,
    setOpen,
    onPaySubmit,
  }
}
