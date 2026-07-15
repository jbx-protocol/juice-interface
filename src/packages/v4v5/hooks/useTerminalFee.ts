import {
  JBCoreContracts,
  jbMultiTerminalV5Abi,
} from '@bananapus/nana-sdk-core'
import { useReadContract } from 'wagmi'

import { useJBContractContext } from '@bananapus/nana-sdk-react'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

/**
 * The v6 protocol fee (2.5%) expressed per billion, matching the units of the v4/v5
 * `JBMultiTerminal.FEE()` getter. v6 made the fee a compile-time constant
 * (`JBConstants.STANDARD_FEE`), so there is nothing to read onchain.
 */
const V6_TERMINAL_FEE_PER_BILLION = 25_000_000n

/**
 * The terminal fee (per billion) for the current project's version.
 */
export function useTerminalFee(): bigint | undefined {
  const { version } = useV4V5Version()
  const { contractAddress } = useJBContractContext()

  const { data: v5Fee } = useReadContract({
    abi: jbMultiTerminalV5Abi,
    address: contractAddress(JBCoreContracts.JBMultiTerminal),
    functionName: 'FEE',
    query: { enabled: version !== 6 },
  })

  return version === 6 ? V6_TERMINAL_FEE_PER_BILLION : v5Fee
}
