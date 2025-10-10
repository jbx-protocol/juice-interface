import { Trans } from '@lingui/macro'
import { JBChainId } from 'juice-sdk-core'
import { useCallback } from 'react'
import { Address } from 'viem'
import { SafeProposeTransactionResponse } from '../../hooks/useProposeSafeTransaction'
import { useProposeSafeTransferOwnershipTx } from '../../hooks/useProposeSafeTransferOwnershipTx'
import QueueSafeTxsModal from '../QueueSafeTxsModal'

export interface QueueSafeTransferOwnershipTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  safeAddress: string
  fromAddress: Address
  toAddress: Address
  onTxComplete?: (chainId: JBChainId, result: SafeProposeTransactionResponse) => void
}

export default function QueueSafeTransferOwnershipTxsModal({
  open,
  onCancel,
  safeAddress,
  fromAddress,
  toAddress,
  onTxComplete,
}: QueueSafeTransferOwnershipTxsModalProps) {
  const { proposeTransferOwnershipTx } = useProposeSafeTransferOwnershipTx({ safeAddress })

  const handleExecuteChain = useCallback(
    async (chainId: JBChainId, signerAddress?: string): Promise<SafeProposeTransactionResponse> => {
      return await proposeTransferOwnershipTx(chainId, fromAddress, toAddress, signerAddress)
    },
    [proposeTransferOwnershipTx, fromAddress, toAddress],
  )

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={<Trans>Queue Safe Transfer Ownership Transactions</Trans>}
      description={
        <Trans>
          Since your project is owned by a Safe wallet, you need to queue separate transactions on each chain.
        </Trans>
      }
      onExecuteChain={handleExecuteChain}
      safeAddress={safeAddress}
      onTxComplete={onTxComplete}
      buttonTextOverride={{
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>,
      }}
    />
  )
}
