import { ETH_CURRENCY_ID, NATIVE_TOKEN, jbDirectoryAbi, jbTerminalStoreAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import {
  JBChainId,
  useJBRulesetContext,
  useJBTerminalContext,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

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
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

  const directoryAddress = chainId ? jbContractAddress[versionString][JBCoreContracts.JBDirectory][chainId] : undefined

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
