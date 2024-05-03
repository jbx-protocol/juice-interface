import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { TxStatus } from 'models/transaction'
import { useCallback, useContext, useMemo, useReducer } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import * as Yup from 'yup'
import { useProjectDispatch, useProjectSelector } from '../../redux/hooks'
import { projectCartActions } from '../../redux/projectCartSlice'
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

const getValidationSchema = (projectHasPayNotice: boolean) =>
  projectHasPayNotice
    ? ValidationSchema.shape({
        userAcceptsNotice: Yup.boolean().oneOf(
          [true],
          "You must understand and accept this project's notice.",
        ),
      })
    : ValidationSchema

export type PayProjectModalFormValues = Yup.InferType<typeof ValidationSchema>

export const usePayProjectModal = () => {
  const { payModalOpen, payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  const dispatch = useProjectDispatch()
  const { projectMetadata } = useProjectMetadataContext()
  const { name, payDisclosure } = projectMetadata ?? {}
  const { userAddress } = useWallet()
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
      dispatch(projectCartActions.setPayModal({ open }))
    },
    [dispatch],
  )

  const onPaySubmit = usePayProjectTx({
    onTransactionPending: () => {
      modalDispatch({ type: 'transactionPending' })
    },
    onTransactionConfirmed: (payReceipt, formikHelpers) => {
      setProjectPayReceipt(payReceipt)
      setOpen(false)
      dispatch(projectCartActions.payProject())
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
    if (!payAmount)
      return formatCurrencyAmount({ amount: 0, currency: V2V3_CURRENCY_ETH })
    return formatCurrencyAmount(payAmount)
  }, [payAmount])

  const secondaryAmount = useMemo(() => {
    if (!payAmount) return undefined
    if (payAmount.currency === V2V3_CURRENCY_ETH) {
      const amount = Number(converter.weiToUsd(parseWad(payAmount.amount)))
      return formatCurrencyAmount({
        amount,
        currency: V2V3_CURRENCY_USD,
      })
    }
    return formatCurrencyAmount({
      amount: fromWad(converter.usdToWei(payAmount.amount)),
      currency: V2V3_CURRENCY_ETH,
    })
  }, [converter, payAmount])

  const pendingTransactionHash = useMemo(() => {
    const pendingTransaction = transactions?.find(
      tx => tx.status === TxStatus.pending,
    )
    return pendingTransaction?.tx?.hash
  }, [transactions])

  const validationSchema = useMemo(
    () => getValidationSchema(!!payDisclosure),
    [payDisclosure],
  )

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    nftRewards: chosenNftRewards,
    validationSchema,
    projectName: name,
    projectPayDisclosure: payDisclosure,
    pendingTransactionHash,
    ...modalState,
    setOpen,
    onPaySubmit,
  }
}
