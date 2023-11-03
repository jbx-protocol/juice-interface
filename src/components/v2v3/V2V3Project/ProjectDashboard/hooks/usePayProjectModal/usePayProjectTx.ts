import { useUniswapPriceQuery } from 'components/AMMPrices/hooks/useERC20UniswapPrice'
import { BUYBACK_DELEGATE_ENABLED_PROJECT_IDS } from 'constants/buybackDelegateEnabledProjectIds'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber, Transaction } from 'ethers'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/usePayETHPaymentTerminalTx'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useCallback, useContext } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { encodeDelegateMetadata } from 'utils/delegateMetadata/encodeDelegateMetadata'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_RESERVED_RATE } from 'utils/v2v3/math'
import { useProjectCart } from '../useProjectCart'
import { useProjectContext } from '../useProjectContext'
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
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenAddress, tokenSymbol, fundingCycleMetadata } =
    useProjectContext()
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayETHPaymentTerminalTx()
  const { receivedTickets } = useProjectPaymentTokens()
  const projectHasErc20 = useProjectHasErc20()

  const { data: priceQuery } = useUniswapPriceQuery({
    tokenAddress,
    tokenSymbol,
  })

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

  const buildPayDelegateMetadata = useCallback(
    (weiAmount: BigNumber) => {
      const tierIdsToMint = nftRewards
        .map(({ id, quantity }) => Array<number>(quantity).fill(id))
        .flat()

      const receivedTicketsWei = parseWad(receivedTickets?.replace(',', ''))

      // Total tokens that should be minted by pay() tx, including reserved tokens
      const requiredTokens =
        fundingCycleMetadata && fundingCycleMetadata.reservedRate.gt(0)
          ? receivedTicketsWei
              .mul(MAX_RESERVED_RATE)
              .div(fundingCycleMetadata.reservedRate)
          : receivedTicketsWei

      const priceQueryNumeratorRaw =
        priceQuery?.projectTokenPrice.numerator.toString()
      const priceQueryDenominatorRaw =
        priceQuery?.projectTokenPrice.denominator.toString()
      const priceQueryNumerator = priceQueryNumeratorRaw
        ? BigNumber.from(priceQueryNumeratorRaw)
        : undefined
      const priceQueryDenominator = priceQueryNumeratorRaw
        ? BigNumber.from(priceQueryDenominatorRaw)
        : undefined
      const inversePriceQueryFactor =
        priceQueryNumerator?.gt(0) && priceQueryDenominator?.gt(0)
          ? priceQueryDenominator.div(priceQueryNumerator)
          : undefined

      // Using inverse price query helps avoid dividing by zero. This assumes the token price is < 1ETH
      const expectedTokensFromSwap = inversePriceQueryFactor?.gt(0)
        ? weiAmount.mul(inversePriceQueryFactor)
        : undefined

      /**
       * Expect whichever is greater: 95% of expected tokens from swap, or minimum amount of tokens required to be minted.
       * We don't really care if less tokens are returned from the swap than what we've estimated (as long as we're getting at least the minimum amount that would otherwise be minted).
       * The main concern is sending as high a minimum as possible to limit arbitrage possibility.
       */
      const minExpectedTokens =
        requiredTokens &&
        expectedTokensFromSwap &&
        expectedTokensFromSwap.mul(95).div(100).gt(requiredTokens)
          ? expectedTokensFromSwap.mul(95).div(100)
          : requiredTokens

      const shouldUseBuybackDelegate =
        Boolean(
          projectId &&
            priceQuery &&
            BUYBACK_DELEGATE_ENABLED_PROJECT_IDS.includes(projectId) &&
            requiredTokens &&
            expectedTokensFromSwap?.gte(requiredTokens) &&
            // total token amount must be less than half of available liquidity (arbitrary) to avoid slippage
            BigNumber.from(requiredTokens).mul(2).lt(priceQuery.liquidity),
        ) && minExpectedTokens !== undefined

      console.info(
        '🧃 useProjectPayTx::use buy back delegate::',
        shouldUseBuybackDelegate,
        {
          weiAmount: weiAmount.toString(),
          priceQueryNumerator,
          priceQueryDenominator,
          requiredTokens: requiredTokens?.toString(),
          expectedTokensFromSwap: expectedTokensFromSwap?.toString(),
          minExpectedTokens: minExpectedTokens?.toString(),
        },
      )

      // Encode metadata for jb721Delegate AND/OR jbBuybackDelegate
      const delegateMetadata = encodeDelegateMetadata({
        jb721Delegate: {
          metadata: {
            tierIdsToMint,
            allowOverspending:
              nftRewards.length > 0 ? DEFAULT_ALLOW_OVERSPENDING : undefined,
          },
          version: JB721DelegateVersion,
        },
        jbBuybackDelegate: shouldUseBuybackDelegate
          ? {
              amountToSwap: 0, // use all ETH
              minExpectedTokens,
            }
          : undefined,
      })

      return delegateMetadata
    },
    [
      JB721DelegateVersion,
      fundingCycleMetadata,
      nftRewards,
      priceQuery,
      projectId,
      receivedTickets,
    ],
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

      let weiAmount: BigNumber
      if (!totalAmount) {
        weiAmount = parseWad(0)
      } else if (totalAmount.currency === V2V3_CURRENCY_ETH) {
        weiAmount = parseWad(totalAmount.amount)
      } else {
        weiAmount = converter.usdToWei(totalAmount.amount)
      }

      let onError = undefined
      try {
        const delegateMetadata = buildPayDelegateMetadata(weiAmount)

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
      buildPayDelegateMetadata,
    ],
  )
}
