import { ETH_CURRENCY_ID, NATIVE_TOKEN, jbDirectoryAbi, jbTerminalStoreAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import {
  JBChainId,
  useJBRulesetContext,
  useJBTerminalContext,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'

import { zeroAddress } from 'viem'

export const useUsedPayoutLimitOf = ({
  chainId,
  projectId,
}: {
  chainId: JBChainId | undefined
  projectId: bigint | undefined
}) => {
  const { store } = useJBTerminalContext()
  const { ruleset } = useJBRulesetContext()

  const directoryAddress = chainId ? jbContractAddress['4'][JBCoreContracts.JBDirectory][chainId] : undefined

  const { data: terminalAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: directoryAddress,
    functionName: 'primaryTerminalOf',
    args: [projectId ?? 0n, NATIVE_TOKEN],
    chainId,
  })

  const { data: usedPayoutLimit, isLoading } = useReadContract({
    abi: jbTerminalStoreAbi,
    address: store.data ?? undefined,
    functionName: 'usedPayoutLimitOf',
    args: [
      terminalAddress ?? zeroAddress,
      projectId ?? 0n,
      NATIVE_TOKEN,
      BigInt(ruleset.data?.cycleNumber ?? 0),
      BigInt(ETH_CURRENCY_ID),
    ],
    chainId,
  })

  return { data: usedPayoutLimit, isLoading }
}
