import { getTokenCashOutQuoteEth } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRulesetContext,
  useNativeTokenSurplus,
  useReadJbControllerPendingReservedTokenBalanceOf,
  useReadJbTokensTotalSupplyOf,
} from 'juice-sdk-react'

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
    return getTokenCashOutQuoteEth(tokenAmountWei, {
      cashOutTaxRate: Number(cashOutTaxRate),
      totalSupply,
      tokensReserved,
      overflowWei: nativeTokenSurplus,
    })
  } catch (e) {
    // Division by zero can cause a RangeError
    if (e instanceof RangeError) {
      return
    } else {
      throw e
    }
  }
}
