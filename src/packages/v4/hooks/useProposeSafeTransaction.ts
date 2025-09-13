import Safe, { Eip1193Provider, SafeTransactionOptionalProps } from '@safe-global/protocol-kit'
import { MetaTransactionData, OperationType } from '@safe-global/types-kit'

import SafeApiKit from '@safe-global/api-kit'
import { estimateTxBaseGas } from '@safe-global/protocol-kit'
import { NETWORKS } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { JBChainId } from 'juice-sdk-core'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { getAddress } from 'viem'

// constants for gas estimation
const MAX_REFUND_GAS_PRICE = '160000000000' // optional refund gas price
const BUFFER = 5000

interface ProposeSafeTransactionProps {
  safeAddress: string
}

interface TransactionDetails {
  to: string
  value: string
  data: string
  operation?: OperationType
  chainId: JBChainId
}

export interface SafeProposeTransactionResponse {
  safeTxHash: string
  nonce: string
}

export function useProposeSafeTransaction({ safeAddress }: ProposeSafeTransactionProps) {
  const { signer, userAddress, eip1193Provider } = useWallet()
  
  const signerAddress = signer?.address ?? '';
  
  // todo remove
  emitErrorNotification(`${signerAddress} ${userAddress}`)
  const [isLoading, setIsLoading] = useState(false)

  const proposeTransaction = async (
    txDetails: TransactionDetails,
  ): Promise<SafeProposeTransactionResponse> => {
    const chainId = txDetails.chainId
    if (!signer || !userAddress) {
      emitErrorNotification('Wallet not connected or chain is unsupported.')
      throw new Error('Wallet not connected or chain is unsupported.')
    }

    setIsLoading(true)
    try {
      const networkInfo = NETWORKS[chainId]
      if (!networkInfo) {
        throw new Error(`Unsupported chain ID: ${chainId}`)
      }
      
      const apiKit = new SafeApiKit({ chainId: BigInt(chainId) })
      
      // Convert addresses to checksum format
      const checksumSignerAddress = getAddress(signerAddress)
      const checksumSafeAddress = getAddress(safeAddress)
      
      const protocolKit = await Safe.init({
        provider: eip1193Provider as unknown as Eip1193Provider,
        signer: checksumSignerAddress,
        safeAddress: checksumSafeAddress,
      })

      const safeTransactionData: MetaTransactionData = {
        to: getAddress(txDetails.to),
        value: txDetails.value,
        data: txDetails.data,
        operation: txDetails.operation ?? OperationType.Call,
      }

      // first pass: estimate base gas
      const optionsFirstPass: SafeTransactionOptionalProps = {}
      const tx1 = await protocolKit.createTransaction({
        transactions: [safeTransactionData],
        options: optionsFirstPass,
        onlyCalls: true,
      })
      const baseGas = Number(
        await estimateTxBaseGas(protocolKit, tx1)
      )

      // compute final options
      const options: SafeTransactionOptionalProps = {
        ...optionsFirstPass,
        safeTxGas: (BigInt(tx1.data.safeTxGas) * 2n).toString(),
        baseGas: (baseGas + BUFFER).toString(),
      }

      // final transaction creation and signature
      const safeTx = await protocolKit.createTransaction({
        transactions: [safeTransactionData],
        options,
        onlyCalls: true,
      })
      const txHash = await protocolKit.getTransactionHash(safeTx)
      const signature = await protocolKit.signHash(txHash)

      // propose transaction to service
      await apiKit.proposeTransaction({
        safeAddress: checksumSafeAddress,
        safeTransactionData: safeTx.data,
        safeTxHash: txHash,
        senderAddress: checksumSignerAddress,
        senderSignature: signature.data,
      })

      return {
        safeTxHash: txHash,
        nonce: safeTx.data.nonce.toString(),
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      emitErrorNotification(`Proposal failed: ${message}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { proposeTransaction, isLoading }
}
