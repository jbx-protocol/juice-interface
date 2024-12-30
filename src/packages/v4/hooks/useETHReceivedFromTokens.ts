import {
  useJBContractContext,
  useJBRulesetContext,
  useNativeTokenSurplus,
  useReadJbControllerPendingReservedTokenBalanceOf,
  useReadJbTokensTotalSupplyOf,
} from 'juice-sdk-react'

import { getTokenCashOutQuoteEth } from 'juice-sdk-core'

export function useETHReceivedFromTokens(
  tokenAmountWei: bigint | undefined,
): bigint | undefined {
  const { projectId, contracts } = useJBContractContext()
  const { rulesetMetadata } = useJBRulesetContext()
  const { data: totalSupply } = useReadJbTokensTotalSupplyOf({
    args: [projectId],
  })
  const { data: nativeTokenSurplus } = useNativeTokenSurplus()

  const { data: tokensReserved } =
    useReadJbControllerPendingReservedTokenBalanceOf({
      address: contracts.controller.data ?? undefined,
      args: [projectId],
    })
  const cashOutTaxRate = rulesetMetadata.data?.cashOutTaxRate?.value

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
