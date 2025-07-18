import {
  DEFAULT_METADATA,
  NATIVE_TOKEN,
  readJbDirectoryPrimaryTerminalOf,
} from 'juice-sdk-core'
import {
  JBChainId,
  useJBProjectId,
  useJBRulesetContext,
  usePreparePayMetadata,
  useSuckers,
  useWriteJbMultiTerminalPay,
} from 'juice-sdk-react'
import { useCallback, useContext, useMemo } from 'react'
import { Address, Hash, parseEther, zeroAddress } from 'viem'

import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from 'contexts/Para/Providers'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { FormikHelpers } from 'formik'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useWallet } from 'hooks/Wallet'
import { useProjectSelector } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { ProjectPayReceipt } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { emitErrorNotification } from 'utils/notifications'
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
  const { data: nftCredits } = useV4UserNftCredits()
  const { payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  const {
    nftRewards: { rewardTiers },
  } = useV4NftRewards()
  const converter = useCurrencyConverter()
  const { data: suckers } = useSuckers()
  const { projectId } = useJBProjectId()

  const { receivedTickets } = useProjectPaymentTokens()
  // TODO: is this needed for preferClaimedTokens?
  const projectHasErc20 = useProjectHasErc20Token()

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
    }
    let weiAmount =
      payAmount.currency === V4_CURRENCY_ETH
        ? parseEther(payAmount.amount.toString())
        : converter.usdToWei(payAmount.amount).toBigInt()
    if (nftCredits) {
      if (nftCredits >= weiAmount) {
        weiAmount = 0n
      } else {
        weiAmount -= nftCredits
      }
    }

    return weiAmount
  }, [converter, nftCredits, payAmount])

  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()
  const metadata = usePreparePayMetadata(
    rulesetMetadata?.dataHook
      ? {
          jb721Hook: {
            dataHookAddress: rulesetMetadata.dataHook,
            tierIdsToMint: chosenNftRewards
              .map(({ id, quantity }) => Array(quantity).fill(BigInt(id)))
              .flat(),
          },
        }
      : undefined,
  )

  const { writeContractAsync: writePay } = useWriteJbMultiTerminalPay()
  const { addTransaction } = useContext(TxHistoryContext)

  return useCallback(
    async (
      values: PayProjectModalFormValues,
      formikHelpers: FormikHelpers<PayProjectModalFormValues>,
      chainId: JBChainId,
    ) => {
      // find project id for the given chain
      const _projectId =
        suckers && suckers.length > 0
          ? suckers?.find(({ peerChainId }) => chainId === peerChainId)
              ?.projectId
          : projectId

      // fetch the terminal address for the project on the chain. We don't necessarily know this ahead of time
      // (if the chain is different from the current route.)
      const terminalAddress = await readJbDirectoryPrimaryTerminalOf(
        wagmiConfig,
        {
          chainId,
          args: [_projectId ?? 0n, NATIVE_TOKEN],
        },
      )

      console.info('🧃 PAY STATE', {
        terminalAddress,
        projectId: _projectId,
        chainId,
        userAddress,
        acceptedTerms: values.userAcceptsTerms,
        suckers,
      })

      if (!values.userAcceptsTerms) {
        emitErrorNotification(
          'You must accept the terms and conditions to proceed.',
        )
        return
      }

      if (
        !terminalAddress ||
        terminalAddress === zeroAddress ||
        !userAddress ||
        !_projectId
      ) {
        emitErrorNotification('Something went wrong! Try again.')
        return
      }

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
      const beneficiary = (values.beneficiaryAddress ?? userAddress) as Address

      const args = [
        _projectId,
        NATIVE_TOKEN,
        weiAmount,
        beneficiary,
        0n,
        memo,
        metadata ?? DEFAULT_METADATA,
      ] as const

      // SIMULATE TRANSACTION:
      // const encodedData = encodeFunctionData({
      //   abi: jbMultiTerminalAbi, // ABI of the contract
      //   functionName: 'pay',
      //   args,
      // })

      try {
        const hash = await writePay({
          chainId,
          address: terminalAddress,
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
      projectId,
      weiAmount,
      userAddress,
      chosenNftRewards,
      suckers,
      metadata,
      rewardTiers,
      writePay,
      onTransactionPendingCallback,
      addTransaction,
      onTransactionConfirmedCallback,
      buildPayReceipt,
      onTransactionErrorCallback,
    ],
  )
}
