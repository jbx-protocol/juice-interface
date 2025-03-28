import { Transaction } from '@ethersproject/transactions'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { ProjectPayReceipt } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import { useProjectSelector } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/redux/hooks'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { useNftCredits } from 'packages/v2v3/hooks/JB721Delegate/useNftCredits'
import { usePayETHPaymentTerminalTx } from 'packages/v2v3/hooks/transactor/usePayETHPaymentTerminalTx'
import { useProjectHasErc20 } from 'packages/v2v3/hooks/useProjectHasErc20'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { useCallback, useContext, useMemo } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { parseWad } from 'utils/format/formatNumber'
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
  const { data: nftCredits } = useNftCredits(userAddress)
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
    }
    let weiAmount =
      payAmount.currency === V2V3_CURRENCY_ETH
        ? parseWad(payAmount.amount)
        : converter.usdToWei(payAmount.amount)
    if (chosenNftRewards.length > 0) {
      if (nftCredits) {
        if (nftCredits.gte(weiAmount)) {
          weiAmount = parseWad(0)
        } else {
          weiAmount = weiAmount.sub(nftCredits)
        }
      }
    }
    return weiAmount
  }, [payAmount, converter, chosenNftRewards.length, nftCredits])

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
            onError ??
              new Error(
                'Payment failed. Make sure your wallet has funds, is set to the correct chain (e.g. mainnet) and try again. If problems persist, click "Reset Website".',
              ),
            formikHelpers,
          )
        }
      } catch (e) {
        onTransactionErrorCallback(e as Error, formikHelpers)
      }
    },
    [
      chosenNftRewards,
      userAddress,
      rewardTiers,
      payProjectTx,
      prepareDelegateMetadata,
      weiAmount,
      projectHasErc20,
      onTransactionConfirmedCallback,
      buildPayReceipt,
      onTransactionPendingCallback,
      onTransactionErrorCallback,
    ],
  )
}
