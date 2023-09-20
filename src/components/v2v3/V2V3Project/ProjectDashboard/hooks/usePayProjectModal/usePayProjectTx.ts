import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { Transaction } from 'ethers'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/usePayETHPaymentTerminalTx'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useCallback, useContext } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { encodeJb721DelegateMetadata } from 'utils/encodeJb721DelegateMetadata/encodeJb721DelegateMetadata'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectCart } from '../useProjectCart'
import { ProjectPayReceipt } from '../useProjectPageQueries'
import { useProjectPaymentTokens } from '../useProjectPaymentTokens'
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
    payReceipt: ProjectPayReceipt,
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
  const { receivedTickets } = useProjectPaymentTokens()
  const projectHasErc20 = useProjectHasErc20()

  const buildPayReceipt = useCallback(
    (e: Transaction | undefined): ProjectPayReceipt => {
      return {
        totalAmount: totalAmount ?? {
          amount: 0,
          currency: V2V3_CURRENCY_ETH,
        },
        nfts: nftRewards ?? [],
        timestamp: new Date(),
        transactionHash: e?.hash,
        fromAddress: userAddress ?? '',
        tokensReceived: receivedTickets ?? '',
      }
    },
    [nftRewards, receivedTickets, totalAmount, userAddress],
  )

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

      let onError = undefined
      try {
        const success = await payProjectTx(
          {
            memo,
            beneficiary,
            delegateMetadata,
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
      JB721DelegateVersion,
      buildPayReceipt,
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
