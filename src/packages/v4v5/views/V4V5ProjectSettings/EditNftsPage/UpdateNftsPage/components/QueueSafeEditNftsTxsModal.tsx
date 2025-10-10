import { SafeProposeTransactionResponse, useProposeSafeTransaction } from 'packages/v4v5/hooks/useProposeSafeTransaction'

import { Trans } from '@lingui/macro'
import { JBChainId } from 'juice-sdk-core'
import { NftRewardTier } from 'models/nftRewards'
import QueueSafeTxsModal from 'packages/v4v5/components/QueueSafeTxsModal'
import { usePopulateNftUpdateTx } from 'packages/v4v5/hooks/usePopulateNftUpdateTx'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useCallback } from 'react'
import { emitInfoNotification } from 'utils/notifications'

export interface QueueSafeEditNftsTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  rewardTiers: NftRewardTier[]
  editedRewardTierIds: number[]
  onSuccess?: () => void
}

export default function QueueSafeEditNftsTxsModal({
  open,
  onCancel,
  rewardTiers,
  editedRewardTierIds,
  onSuccess,
}: QueueSafeEditNftsTxsModalProps) {
  const { data: safeAddress } = useV4V5ProjectOwnerOf()
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress: safeAddress || '' })
  const { populateTransaction } = usePopulateNftUpdateTx()

  const handleExecuteNftUpdateOnChain = useCallback(async (chainId: JBChainId, signerAddress?: string) => {
    if (!safeAddress) throw new Error('Safe address is required')

    // 1. Prepare transaction data for NFT update
    const txData = await populateTransaction(rewardTiers, editedRewardTierIds)

    // 2. Propose the transaction to the Safe service
    const result: SafeProposeTransactionResponse = await proposeTransaction({
      to: txData.to,
      data: txData.data,
      value: txData.value,
      chainId,
      signerAddressOverride: signerAddress,
    })

    emitInfoNotification(`Safe transaction queued on ${chainId}`)

    return result
  }, [safeAddress, populateTransaction, rewardTiers, editedRewardTierIds, proposeTransaction])

  const handleTxComplete = useCallback((chainId: JBChainId, result: SafeProposeTransactionResponse) => {
    // Transaction completed successfully
  }, [])

  const handleModalClose = useCallback(() => {
    onCancel()
    if (onSuccess) {
      onSuccess()
    }
  }, [onCancel, onSuccess])

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={handleModalClose}
      title={<Trans>Queue Safe NFT Edit Transactions</Trans>}
      description={
        <Trans>
          Since your project owner is a Gnosis Safe and this is an omnichain project, you need to queue separate transactions on each chain.
        </Trans>
      }
      onExecuteChain={handleExecuteNftUpdateOnChain}
      safeAddress={safeAddress || ''}
      onTxComplete={handleTxComplete}
      buttonTextOverride={{
        completed: <Trans>Queued</Trans>,
        connectWallet: <Trans>Connect wallet</Trans>,
        switchChain: (chainName: string) => <Trans>Switch to {chainName}</Trans>,
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>,
      }}
    />
  )
}
