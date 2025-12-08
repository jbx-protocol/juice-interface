import {
  JBChainId,
  useJBContractContext,
  useNativeTokenSurplus,
} from 'juice-sdk-react'
import { jbControllerAbi, jbTokensAbi, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'

import { getTokenCashOutQuoteEth } from 'juice-sdk-core'
import { useJBRulesetByChain } from './useJBRulesetByChain'

export function useETHReceivedFromTokens(
  tokenAmountWei: bigint | undefined,
  chainId: JBChainId | undefined,
): bigint | undefined {
  const { projectId, contracts, contractAddress } = useJBContractContext()
  const { data: totalSupply } = useReadContract({
    abi: jbTokensAbi,
    address: contractAddress(JBCoreContracts.JBTokens, chainId),
    functionName: 'totalSupplyOf',
    args: [projectId],
    chainId,
  })
  const { data: nativeTokenSurplus } = useNativeTokenSurplus({ chainId })
  const { rulesetMetadata } = useJBRulesetByChain(chainId)
  const { data: tokensReserved } = useReadContract({
    abi: jbControllerAbi,
    address: contracts.controller.data ?? undefined,
    functionName: 'pendingReservedTokenBalanceOf',
    args: [projectId],
    chainId,
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
