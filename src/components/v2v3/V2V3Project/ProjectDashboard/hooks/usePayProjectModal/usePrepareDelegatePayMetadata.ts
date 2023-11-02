import { useUniswapPriceQuery } from 'components/AMMPrices/hooks/useERC20UniswapPrice'
import { BUYBACK_DELEGATE_ENABLED_PROJECT_IDS } from 'constants/buybackDelegateEnabledProjectIds'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import { encodeDelegatePayMetadata } from 'utils/delegateMetadata/encodeDelegateMetadata'
import { parseWad } from 'utils/format/formatNumber'
import { MAX_RESERVED_RATE } from 'utils/v2v3/math'
import { ProjectCartNftReward } from '../../components/ProjectCartProvider'
import { useProjectContext } from '../useProjectContext'

export function usePreparePayDelegateMetadata(
  weiAmount: BigNumber,
  {
    nftRewards,
    receivedTickets,
  }: {
    nftRewards: ProjectCartNftReward[]
    receivedTickets: string | undefined
  },
) {
  const { tokenAddress, tokenSymbol, fundingCycleMetadata } =
    useProjectContext()
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: priceQuery } = useUniswapPriceQuery({
    tokenAddress,
    tokenSymbol,
  })

  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )
  const tierIdsToMint = nftRewards
    .map(({ id, quantity }) => Array<number>(quantity).fill(id))
    .flat()

  // Total tokens that should be minted by pay() tx, including reserved tokens
  const requiredTokens = fundingCycleMetadata
    ? parseWad(receivedTickets?.replace(',', ''))
        .mul(MAX_RESERVED_RATE)
        .div(fundingCycleMetadata.reservedRate)
    : undefined

  const priceQueryNumerator = priceQuery?.projectTokenPrice.numerator.toString()
  const priceQueryDenominator =
    priceQuery?.projectTokenPrice.denominator.toString()
  const inversePriceQueryFactor =
    priceQueryNumerator && priceQueryDenominator
      ? BigNumber.from(priceQueryDenominator).div(
          BigNumber.from(priceQueryNumerator),
        )
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
  const delegateMetadata = encodeDelegatePayMetadata({
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
}
