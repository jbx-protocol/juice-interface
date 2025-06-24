import { GnosisSafe, SafeTransactionType } from 'models/safe'

import { isEqualAddress } from './address'

// Safe network prefixes for Safe UI URLs
const SAFE_NETWORK_PREFIXES: Record<number, string> = {
  1: 'eth',           // Ethereum Mainnet
  11155111: 'sep',    // Sepolia
  42161: 'arb',      // Arbitrum One
  421614: 'arbsep',     // Arbitrum Sepolia (uses same prefix as mainnet)
  10: 'op',         // Optimism
  11155420: 'opsep',   // Optimism Sepolia (uses same prefix as mainnet)
  8453: 'base',       // Base
  84532: 'basesep',      // Base Sepolia (uses same prefix as mainnet)
}

// e.g. [ {nonce: 69}, {nonce: 45}, {nonce: 69}] returns [69, 45]
export function getUniqueNonces(
  transactions: SafeTransactionType[] | undefined,
) {
  return [
    ...new Set<number>(
      transactions?.map((tx: SafeTransactionType) => tx.nonce),
    ),
  ]
}

// returns subset of given transactions for which a given address has not signed
export function getUnsignedTxsForAddress({
  address,
  transactions,
}: {
  address: string
  transactions: SafeTransactionType[] | undefined
}) {
  return transactions?.filter(
    (tx: SafeTransactionType) =>
      !tx?.confirmations?.some(confirmation =>
        isEqualAddress(confirmation.owner, address),
      ),
  )
}

// returns whether given wallet is member of a given Safe multisig
export function isSafeSigner({
  address,
  safe,
}: {
  address: string | undefined
  safe: GnosisSafe
}) {
  if (!address) return false
  return safe.owners.some(owner => isEqualAddress(owner, address))
}

/**
 * Generate a Safe transaction URL for the Safe Web UI
 * @param chainId - The chain ID
 * @param safeAddress - The Safe address
 * @param txHash - Optional transaction hash
 * @returns URL to view the transaction in Safe UI
 */
export function safeTxUrl({
  chainId,
  safeAddress,
  txHash,
}: {
  chainId: number
  safeAddress: string
  txHash?: string
}): string {
  const prefix = SAFE_NETWORK_PREFIXES[chainId]
  if (!prefix) {
    throw new Error(`Unsupported chain ID for Safe UI: ${chainId}`)
  }

  const baseUrl = `https://app.safe.global/transactions/tx?safe=${prefix}:${safeAddress}`
  
  if (txHash) {
    return `${baseUrl}&id=multisig_${safeAddress}_${txHash}`
  }
  
  return baseUrl
}
