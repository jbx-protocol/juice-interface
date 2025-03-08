import { NATIVE_CURRENCY_ID, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  JBChainId,
  useJBRulesetContext,
  useJBTerminalContext,
  useReadJbDirectoryPrimaryTerminalOf,
  useReadJbTerminalStoreUsedPayoutLimitOf
} from 'juice-sdk-react'

import { zeroAddress } from 'viem'

export const useUsedPayoutLimitOf = ({
  chainId,
  projectId,
}: {
  chainId: JBChainId | undefined,
  projectId: bigint | undefined
}) => {
  const { store } = useJBTerminalContext()
  const { ruleset } = useJBRulesetContext()

  const { data: terminalAddress } = useReadJbDirectoryPrimaryTerminalOf({
    chainId,
    args: [projectId ?? 0n, NATIVE_TOKEN],
  })

  const { data: usedPayoutLimit, isLoading } =
    useReadJbTerminalStoreUsedPayoutLimitOf({
      address: store.data ?? undefined,
      chainId,
      args: [
        terminalAddress ?? zeroAddress, 
        projectId ?? 0n,
        NATIVE_TOKEN,
        BigInt(ruleset.data?.cycleNumber ?? 0),
        BigInt(NATIVE_CURRENCY_ID),
      ],
    })

  return { data: usedPayoutLimit, isLoading }
}
