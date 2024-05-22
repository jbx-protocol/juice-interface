import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { Transaction } from 'ethers'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/usePayETHPaymentTerminalTx'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useCallback, useContext, useMemo } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectSelector } from '../../redux/hooks'
import { ProjectPayReceipt } from '../useProjectPageQueries'
import { useProjectPaymentTokens } from '../useProjectPaymentTokens'
import { PayProjectModalFormValues } from './usePayProjectModal'
import { usePrepareDelegatePayMetadata } from './usePrepareDelegatePayMetadata'

export const usePayProjectTx = ({
  onTransactionPending: onTransactionPendingCallback,
  onTransactionConfirmed: onTransactionConfirmedCallback,
  onTransactionError: onTransactionErrorCallback,
}: {
  onTransactionPending: (
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionConfirmed: (
    payReceipt: ProjectPayReceipt,
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionError: (
    error: Error,
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
}) => {
  const { userAddress } = useWallet()
  const { payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayETHPaymentTerminalTx()
  const { receivedTickets } = useProjectPaymentTokens()
  const projectHasErc20 = useProjectHasErc20()

  const buildPayReceipt = useCallback(
    (e: Transaction | undefined): ProjectPayReceipt => {
      return {
        totalAmount: payAmount ?? {
          amount: 0,
          currency: V2V3_CURRENCY_ETH,
        },
        nfts: chosenNftRewards ?? [],
        timestamp: new Date(),
        transactionHash: e?.hash,
        fromAddress: userAddress ?? '',
        tokensReceived: receivedTickets ?? '',
      }
    },
    [chosenNftRewards, payAmount, receivedTickets, userAddress],
  )

  const weiAmount = useMemo(() => {
    if (!payAmount) {
      return parseWad(0)
    } else if (payAmount.currency === V2V3_CURRENCY_ETH) {
      return parseWad(payAmount.amount)
    } else {
      return converter.usdToWei(payAmount.amount)
    }
  }, [payAmount, converter])

  const prepareDelegateMetadata = usePrepareDelegatePayMetadata(weiAmount, {
    nftRewards: chosenNftRewards,
    receivedTickets,
  })

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
        nftUrls: chosenNftRewards
          .map(
            ({ id }) =>
              (rewardTiers ?? []).find(({ id: tierId }) => tierId === id)
                ?.fileUrl,
          )
          .filter((url): url is string => !!url),
      })
      const beneficiary = values.beneficiaryAddress ?? userAddress

      let onError = undefined
      try {
        const success = await payProjectTx(
          {
            memo,
            beneficiary,
            delegateMetadata: prepareDelegateMetadata(),
            value: weiAmount,
            // always claim tokens if the project has an ERC20.
            // if project has no erc20, then nothing to claim!
            preferClaimedTokens: projectHasErc20,
          },
          {
            onConfirmed(e) {
              onTransactionConfirmedCallback(buildPayReceipt(e), formikHelpers)
            },
            onError(error) {
              // This is required as the below !success check will throw a
              // second error. The below is necessary as a user rejection does
              // not come through here
              // ¯\_(ツ)_/¯
              onError = error
            },
            onDone() {
              onTransactionPendingCallback(formikHelpers)
            },
          },
        )
        if (!success) {
          onTransactionErrorCallback(
            onError ?? new Error('Transaction failed'),
            formikHelpers,
          )
        }
      } catch (e) {
        onTransactionErrorCallback(e as Error, formikHelpers)
      }
    },
    [
      projectHasErc20,
      buildPayReceipt,
      chosenNftRewards,
      onTransactionConfirmedCallback,
      onTransactionErrorCallback,
      onTransactionPendingCallback,
      payProjectTx,
      rewardTiers,
      weiAmount,
      userAddress,
      prepareDelegateMetadata,
    ],
  )
}
