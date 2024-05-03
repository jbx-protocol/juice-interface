import { useUniswapPriceQuery } from 'components/AMMPrices/hooks/useERC20UniswapPrice'
import { BUYBACK_DELEGATE_ENABLED_PROJECT_IDS } from 'constants/buybackDelegateEnabledProjectIds'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useCallback, useContext } from 'react'
import { encodeDelegatePayMetadata } from 'utils/delegateMetadata/encodeDelegateMetadata'
import { parseWad, stripCommas } from 'utils/format/formatNumber'
import { MAX_RESERVED_RATE } from 'utils/v2v3/math'
import { ProjectCartNftReward } from '../../components/ReduxProjectCartProvider'
import { useProjectContext } from '../useProjectContext'

function usePrepareJbBuybackDelegatePayMetadata({
  weiAmount,
  receivedTickets,
}: {
  weiAmount: BigNumber
  receivedTickets: string | undefined
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenAddress, tokenSymbol, fundingCycleMetadata } =
    useProjectContext()

  const { data: priceQuery } = useUniswapPriceQuery({
    tokenAddress,
    tokenSymbol,
  })

  if (
    !projectId ||
    (projectId && !BUYBACK_DELEGATE_ENABLED_PROJECT_IDS.includes(projectId))
  ) {
    return null
  }

  const receivedTicketsWei = receivedTickets
    ? parseWad(stripCommas(receivedTickets))
    : undefined

  // Total tokens that should be minted by pay() tx, including reserved tokens
  const requiredTokens = receivedTicketsWei
    ? fundingCycleMetadata && fundingCycleMetadata.reservedRate.gt(0)
      ? receivedTicketsWei
          .mul(MAX_RESERVED_RATE)
          .div(fundingCycleMetadata.reservedRate)
      : receivedTicketsWei
    : undefined

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

  if (
    requiredTokens &&
    // ensure we're getting at least the minimum amount of tokens from the swap
    expectedTokensFromSwap?.gte(requiredTokens) &&
    // total token amount must be less than half of available liquidity (arbitrary) to avoid slippage
    priceQuery &&
    BigNumber.from(requiredTokens).mul(2).lt(priceQuery.liquidity) &&
    minExpectedTokens !== undefined
  ) {
    return { minExpectedTokens, amountToSwap: 0 }
  }

  return null
}

function usePrepareJb721DelegateMetadata({
  nftRewards,
}: {
  nftRewards: ProjectCartNftReward[]
}) {
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )
  const tierIdsToMint = nftRewards
    .map(({ id, quantity }) => Array<number>(quantity).fill(id))
    .flat()

  if (tierIdsToMint.length === 0) return null

  return {
    metadata: {
      tierIdsToMint,
      allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
    },
    version: JB721DelegateVersion,
  }
}

export function usePrepareDelegatePayMetadata(
  weiAmount: BigNumber,
  {
    nftRewards,
    receivedTickets,
  }: {
    nftRewards: ProjectCartNftReward[]
    receivedTickets: string | undefined
  },
) {
  const jbBuyBackDelegateMetadata = usePrepareJbBuybackDelegatePayMetadata({
    weiAmount,
    receivedTickets,
  })
  const jb721DelegateMetadata = usePrepareJb721DelegateMetadata({
    nftRewards,
  })

  return useCallback(() => {
    console.info('usePrepareDelegatePayMetadata::', {
      jb721Delegate: jb721DelegateMetadata,
      jbBuybackDelegate: jbBuyBackDelegateMetadata,
    })

    // Encode metadata for jb721Delegate AND/OR jbBuybackDelegate
    const delegateMetadata = encodeDelegatePayMetadata({
      jb721Delegate: jb721DelegateMetadata,
      jbBuybackDelegate: jbBuyBackDelegateMetadata,
    })

    return delegateMetadata
  }, [jbBuyBackDelegateMetadata, jb721DelegateMetadata])
}
