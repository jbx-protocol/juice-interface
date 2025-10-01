import { SafeLaunchProjectData, useProposeSafeLaunchProjectTx } from 'packages/v4v5/hooks/useProposeSafeLaunchProjectTx'
import { useCallback, useMemo } from 'react'

import { Trans } from '@lingui/macro'
import { JBChainId } from 'juice-sdk-react'
import { SafeProposeTransactionResponse } from 'packages/v4v5/hooks/useProposeSafeTransaction'
import QueueSafeTxsModal from './QueueSafeTxsModal'

export interface QueueSafeLaunchProjectTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  onComplete: VoidFunction
  launchData: SafeLaunchProjectData
  chains: JBChainId[]
  safeAddress: string
}

export default function QueueSafeLaunchProjectTxsModal({
  open,
  onCancel,
  onComplete,
  launchData,
  chains,
  safeAddress,
}: QueueSafeLaunchProjectTxsModalProps) {
  const { proposeLaunchProjectTx } = useProposeSafeLaunchProjectTx({ safeAddress })

  const handleExecuteChain = useCallback(
    async (chainId: JBChainId): Promise<SafeProposeTransactionResponse> => {
      return await proposeLaunchProjectTx(chainId, launchData)
    },
    [proposeLaunchProjectTx, launchData],
  )

  const title = <Trans>Queue launch transactions to Safe</Trans>

  const description = useMemo(() => {
    if (chains.length === 1) {
      return (
        <Trans>
          Your project launch transaction will be queued to your Safe wallet for execution.
          Once the required signatures are collected, you can execute the transaction through the Safe interface.
        </Trans>
      )
    }
    return (
      <Trans>
        Your project launch transactions will be queued to your Safe wallet on each selected chain.
        Once the required signatures are collected for each transaction, you can execute them through the Safe interface.
      </Trans>
    )
  }, [chains.length])

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={title}
      description={description}
      onExecuteChain={handleExecuteChain}
      safeAddress={safeAddress}
      chains={chains}
      onTxComplete={(chainId, result) => {
        // Handle individual chain completion if needed
      }}
      onAllComplete={onComplete}
      buttonTextOverride={{
        completed: <Trans>Queued</Trans>,
        connectWallet: <Trans>Connect wallet</Trans>,
        switchChain: (chainName: string) => <Trans>Switch to {chainName}</Trans>,
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>,
      }}
    />
  )
}
