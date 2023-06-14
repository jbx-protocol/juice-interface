import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useCallback, useMemo } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import * as Yup from 'yup'
import { useProjectCart } from './useProjectCart'
import { useProjectMetadata } from './useProjectMetadata'

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
  const { dispatch, payModalOpen, totalAmount, nftRewards } = useProjectCart()
  const { projectMetadata } = useProjectMetadata()
  const { name, payDisclosure } = projectMetadata ?? {}
  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      dispatch({ type: 'setPayModal', payload: { open } })
    },
    [dispatch],
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

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    nftRewards,
    validationSchema: ValidationSchema,
    projectName: name,
    projectPayDisclosure: payDisclosure,
    setOpen,
  }
}
