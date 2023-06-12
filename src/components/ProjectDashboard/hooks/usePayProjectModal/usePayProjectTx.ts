import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/usePayETHPaymentTerminalTx'
import { useCallback, useContext } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { encodeJb721DelegateMetadata } from 'utils/encodeJb721DelegateMetadata/encodeJb721DelegateMetadata'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectCart } from '../useProjectCart'
import { PayProjectModalFormValues } from './usePayProjectModal'

export const usePayProjectTx = ({
  onTransactionPending: onTransactionPendingCallback,
  onTransactionConfirmed: onTransactionConfirmedCallback,
  onTransactionError: onTransactionErrorCallback,
}: {
  onTransactionPending: (
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionConfirmed: (
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionError: (
    error: Error,
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
}) => {
  const { userAddress } = useWallet()
  const { totalAmount, nftRewards } = useProjectCart()
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayETHPaymentTerminalTx()

  return useCallback(
    async (
      values: PayProjectModalFormValues,
      formikHelpers: FormikHelpers<PayProjectModalFormValues>,
    ) => {
      if (!values.userAcceptsTerms) return
      const { messageString, attachedUrl } = values.message
      const memo = buildPaymentMemo({
        text: messageString,
        imageUrl: attachedUrl,
        nftUrls: nftRewards
          .map(
            ({ id }) =>
              (rewardTiers ?? []).find(({ id: tierId }) => tierId === id)
                ?.fileUrl,
          )
          .filter((url): url is string => !!url),
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

      const tierIdsToMint = nftRewards
        .map(({ id, quantity }) => Array<number>(quantity).fill(id))
        .flat()

      const delegateMetadata = encodeJb721DelegateMetadata(
        {
          tierIdsToMint,
          allowOverspending:
            nftRewards.length > 0 ? DEFAULT_ALLOW_OVERSPENDING : undefined,
        },
        JB721DelegateVersion,
      )

      try {
        await payProjectTx(
          {
            memo,
            beneficiary,
            delegateMetadata,
            value: weiAmount,
            preferClaimedTokens: false,
          },
          {
            onConfirmed() {
              onTransactionConfirmedCallback(formikHelpers)
            },
            onError(error) {
              onTransactionErrorCallback(error, formikHelpers)
            },
            onDone() {
              onTransactionPendingCallback(formikHelpers)
            },
          },
        )
      } catch (e) {
        onTransactionErrorCallback(e as Error, formikHelpers)
      }
    },
    [
      JB721DelegateVersion,
      converter,
      nftRewards,
      onTransactionConfirmedCallback,
      onTransactionErrorCallback,
      onTransactionPendingCallback,
      payProjectTx,
      rewardTiers,
      totalAmount,
      userAddress,
    ],
  )
}
