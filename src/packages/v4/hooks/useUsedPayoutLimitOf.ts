import { NATIVE_CURRENCY_ID, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  JBChainId,
  useJBContractContext,
  useJBRulesetContext,
  useJBTerminalContext,
  useReadJbTerminalStoreUsedPayoutLimitOf,
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
  const { contracts } = useJBContractContext()
  const { ruleset } = useJBRulesetContext()

  const { data: usedPayoutLimit, isLoading } =
    useReadJbTerminalStoreUsedPayoutLimitOf({
      address: store.data ?? undefined,
      chainId,
      args: [
        contracts.primaryNativeTerminal.data ?? zeroAddress, // v4TODO: should be below?
        // useReadJbDirectoryPrimaryTerminalOf({
          //   chainId: selectedChainId,
          //   args: [projectId, NATIVE_TOKEN],
          // })  
        projectId ?? 0n,
        NATIVE_TOKEN,
        BigInt(ruleset.data?.cycleNumber ?? 0),
        BigInt(NATIVE_CURRENCY_ID),
      ],
    })

  return { data: usedPayoutLimit, isLoading }
}
