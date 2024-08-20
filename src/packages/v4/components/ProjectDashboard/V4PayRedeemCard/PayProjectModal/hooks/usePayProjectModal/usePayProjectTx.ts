import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectSelector } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { ProjectPayReceipt } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
// import { NftRewardsContext } from 'packages/v4/contexts/NftRewards/NftRewardsContext'
// import { useProjectHasErc20 } from 'packages/v4/hooks/useProjectHasErc20'
import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useWriteJbMultiTerminalPay,
} from 'juice-sdk-react'
// import { useProjectHasErc20 } from 'packages/v2v3/hooks/useProjectHasErc20'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useCallback, useContext, useMemo } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { Address, Hash, parseEther } from 'viem'
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
  const { payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  // const {
  //   nftRewards: { rewardTiers },
  // } = useContext(NftRewardsContext)
  const converter = useCurrencyConverter()
  const { receivedTickets } = useProjectPaymentTokens()
  // const projectHasErc20 = useProjectHasErc20()

  const buildPayReceipt = useCallback(
    (txHash: Hash): ProjectPayReceipt => {
      return {
        totalAmount: payAmount ?? {
          amount: 0,
          currency: V4_CURRENCY_ETH,
        },
        nfts: chosenNftRewards ?? [],
        timestamp: new Date(),
        transactionHash: txHash,
        fromAddress: userAddress ?? '',
        tokensReceived: receivedTickets ?? '',
      }
    },
    [chosenNftRewards, payAmount, receivedTickets, userAddress],
  )

  const weiAmount = useMemo(() => {
    if (!payAmount) {
      return 0n
    } else if (payAmount.currency === V4_CURRENCY_ETH) {
      return parseEther(payAmount.amount.toString())
    } else {
      return converter.usdToWei(payAmount.amount).toBigInt()
    }
  }, [payAmount, converter])

  // const prepareDelegateMetadata = usePrepareDelegatePayMetadata(weiAmount, {
  //   nftRewards: chosenNftRewards,
  //   receivedTickets,
  // })

  const { writeContractAsync: writePay } = useWriteJbMultiTerminalPay()
  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  return useCallback(
    async (
      values: PayProjectModalFormValues,
      formikHelpers: FormikHelpers<PayProjectModalFormValues>,
    ) => {
      if (
        !weiAmount ||
        !contracts.primaryNativeTerminal.data ||
        !userAddress ||
        !values.userAcceptsTerms
      ) {
        return
      }

      const { messageString, attachedUrl } = values.message
      const memo = buildPaymentMemo({
        text: messageString,
        imageUrl: attachedUrl,
        // nftUrls: chosenNftRewards
        //   .map(
        //     ({ id }) =>
        //       (rewardTiers ?? []).find(({ id: tierId }) => tierId === id)
        //         ?.fileUrl,
        //   )
        //   .filter((url): url is string => !!url),
      })
      const beneficiary = (values.beneficiaryAddress ?? userAddress) as Address
      const args = [
        projectId,
        NATIVE_TOKEN,
        weiAmount,
        beneficiary,
        0n,
        `JBM V4 ${projectId}`, // TODO update
        '0x0',
      ] as const

      try {
        const hash = await writePay({
          address: contracts.primaryNativeTerminal.data,
          args,
          value: weiAmount,
        })

        onTransactionPendingCallback(formikHelpers)
        addTransaction?.('Pay', { hash })
        const transactionReceipt = await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash,
          },
        )

        onTransactionConfirmedCallback(buildPayReceipt(hash), formikHelpers)
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
          formikHelpers,
        )
      }
    },
    [
      // projectHasErc20,
      buildPayReceipt,
      // chosenNftRewards,
      onTransactionConfirmedCallback,
      onTransactionErrorCallback,
      onTransactionPendingCallback,
      // payProjectTx,
      // rewardTiers,
      weiAmount,
      userAddress,
      // prepareDelegateMetadata,
      projectId,
      writePay,
      contracts.primaryNativeTerminal.data,
      addTransaction,
    ],
  )
}
