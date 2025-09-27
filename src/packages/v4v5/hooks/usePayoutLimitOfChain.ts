import * as constants from '@ethersproject/constants'

import {
  JBChainId,
  useJBContractContext,
  useJBRuleset,
} from 'juice-sdk-react'

import { NATIVE_TOKEN, jbDirectoryAbi, jbFundAccessLimitsAbi, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'
import { V4CurrencyOption } from '../models/v4CurrencyOption'
import { V4_CURRENCY_ETH } from '../utils/currency'

/**
 * V4todo: add to SDK
 */
export function usePayoutLimitOfChain({
  chainId,
  projectId,
}: {
  chainId: JBChainId | undefined
  projectId: bigint | undefined
}) {
  const {
    contracts: { fundAccessLimits },
  } = useJBContractContext()

  const { ruleset } = useJBRuleset({
    projectId,
    chainId,
  })

  const { contractAddress } = useJBContractContext()

  const { data: terminalAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: contractAddress(JBCoreContracts.JBDirectory),
    functionName: 'primaryTerminalOf',
    args: [projectId ?? 0n, NATIVE_TOKEN],
    chainId,
  })

  const { data: payoutLimits, isLoading } = useReadContract({
    abi: jbFundAccessLimitsAbi,
    address: fundAccessLimits.data ?? undefined,
    functionName: 'payoutLimitsOf',
    args: [
      projectId ?? 0n,
      BigInt(ruleset?.id ?? 0),
      terminalAddress ?? constants.AddressZero,
      NATIVE_TOKEN,
    ],
    chainId,
  })

  const payoutLimit = payoutLimits?.[0]

  return {
    data: payoutLimit
      ? {
          ...payoutLimit,
          currency: Number(payoutLimit.currency) as V4CurrencyOption,
        }
      : {
          amount: 0n,
          currency: V4_CURRENCY_ETH,
        },
    isLoading,
  }
}
