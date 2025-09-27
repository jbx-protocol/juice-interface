import { Trans } from '@lingui/macro'
import { JBChainId } from 'juice-sdk-core'
import { useCallback } from 'react'
import { useProposeSafeEditRulesetTx } from '../../hooks/useProposeSafeEditRulesetTx'
import { SafeProposeTransactionResponse } from '../../hooks/useProposeSafeTransaction'
import { EditCycleFormFields } from '../../views/V4V5ProjectSettings/EditCyclePage/EditCycleFormFields'
import QueueSafeTxsModal from '../QueueSafeTxsModal'

export interface QueueSafeEditRulesetTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  safeAddress: string
  formValues: EditCycleFormFields
  onTxComplete?: (chainId: JBChainId, result: SafeProposeTransactionResponse) => void
}

export default function QueueSafeEditRulesetTxsModal({
  open,
  onCancel,
  safeAddress,
  formValues,
  onTxComplete,
}: QueueSafeEditRulesetTxsModalProps) {
  const { proposeEditRulesetTx } = useProposeSafeEditRulesetTx({ safeAddress })

  const handleExecuteChain = useCallback(
    async (chainId: JBChainId): Promise<SafeProposeTransactionResponse> => {
      return await proposeEditRulesetTx(chainId, formValues)
    },
    [proposeEditRulesetTx, formValues],
  )

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={<Trans>Queue Safe Ruleset Transactions</Trans>}
      description={
        <Trans>
          Since your project owned by a Safe wallet, you need to queue separate transactions on each chain.
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
