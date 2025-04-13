import {
  JBChainId,
  useJBContractContext,
  useNativeTokenSurplus,
  useReadJbControllerPendingReservedTokenBalanceOf,
  useReadJbTokensTotalSupplyOf,
} from 'juice-sdk-react'

import { getTokenCashOutQuoteEth } from 'juice-sdk-core'
import { useJBRulesetByChain } from './useJBRulesetByChain'

export function useETHReceivedFromTokens(
  tokenAmountWei: bigint | undefined,
  chainId: JBChainId | undefined,
): bigint | undefined {
  const { projectId, contracts } = useJBContractContext()
  const { data: totalSupply } = useReadJbTokensTotalSupplyOf({
    args: [projectId],
  })
  const { data: nativeTokenSurplus } = useNativeTokenSurplus()
  const { rulesetMetadata } = useJBRulesetByChain(chainId)
  const { data: tokensReserved } =
    useReadJbControllerPendingReservedTokenBalanceOf({
      chainId,
      address: contracts.controller.data ?? undefined,
      args: [projectId],
    })
  const cashOutTaxRate = rulesetMetadata?.cashOutTaxRate?.value

  if (
    cashOutTaxRate === undefined ||
    totalSupply === undefined ||
    tokensReserved === undefined ||
    tokenAmountWei === undefined ||
    nativeTokenSurplus === undefined
  ) {
    return
  }

  try {
    const eth = getTokenCashOutQuoteEth(tokenAmountWei, {
      cashOutTaxRate: Number(cashOutTaxRate),
      totalSupply,
      tokensReserved,
      overflowWei: nativeTokenSurplus,
    })
    // v4TODO: make SDK return 0n, not 0
    return eth === 0 ? 0n : eth
  } catch (e) {
    // Division by zero can cause a RangeError
    if (e instanceof RangeError) {
      return
    } else {
      throw e
    }
  }
}
