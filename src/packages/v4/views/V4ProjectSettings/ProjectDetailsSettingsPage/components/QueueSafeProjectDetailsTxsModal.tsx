import { FormInstance, useWatch } from 'antd/lib/form/Form'
import { JBChainId, JBProjectMetadata } from 'juice-sdk-core'

import { Trans } from '@lingui/macro'
import { ProjectDetailsFormFields } from 'components/Project/ProjectSettings/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import QueueSafeTxsModal from 'packages/v4/components/QueueSafeTxsModal'
import { useEditProjectDetailsTx } from 'packages/v4/hooks/useEditProjectDetailsTx'
import { useCallback } from 'react'

export interface QueueSafeProjectDetailsTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  form?: FormInstance<ProjectDetailsFormFields>
  projectMetadata?: JBProjectMetadata
}
export default function QueueSafeProjectDetailsTxsModal({
  open,
  onCancel,
  form,
  projectMetadata,
}: QueueSafeProjectDetailsTxsModalProps) {
  const editProjectDetailsTx = useEditProjectDetailsTx()
  const formData = useWatch([], form) as ProjectDetailsFormFields | undefined

  const handleExecuteProjectDetailsOnChain = useCallback(async (chainId: JBChainId) => {
    if (!formData) {
      throw new Error('Form data is required')
    }

    // Upload metadata first
    const uploadedMetadata = await uploadProjectMetadata({
      name: formData.name || projectMetadata?.name || '',
      description: formData.description || projectMetadata?.description || '',
      projectTagline: formData.projectTagline || '',
      projectRequiredOFACCheck: formData.projectRequiredOFACCheck || false,
      logoUri: formData.logoUri || projectMetadata?.logoUri || '',
      coverImageUri: formData.coverImageUri || '',
      infoUri: formData.infoUri || projectMetadata?.infoUri || '',
      twitter: formData.twitter || '',
      discord: formData.discord || '',
      telegram: formData.telegram || '',
      payButton: (formData.payButton || '').substring(0, PROJECT_PAY_CHARACTER_LIMIT),
      payDisclosure: formData.payDisclosure || '',
      tags: formData.tags || [],
    })

    if (!uploadedMetadata.Hash) {
      throw new Error('Failed to upload metadata')
    }

    const hash = uploadedMetadata.Hash as `0x${string}`

    // Use the single-chain edit logic with Promise wrapper for error handling
    return new Promise<void>((resolve, reject) => {
      editProjectDetailsTx(hash, {
        onTransactionPending: () => {
          // Transaction pending
        },
        onTransactionConfirmed: () => {
          resolve()
        },
        onTransactionError: (error) => {
          console.error('Transaction error:', error)
          reject(new Error(`Failed to save project details on chain ${chainId}: ${error.message}`))
        }
      }).catch(reject)
    })
  }, [formData, projectMetadata, editProjectDetailsTx])

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={<Trans>Queue Safe Project Details Transactions</Trans>}
      description={
        <Trans>
          Since your project owner is a Gnosis Safe and this is an omnichain project,
          you need to submit separate transactions on each chain. Click the button for each
          chain to submit the project details update transaction.
        </Trans>
      }
      onExecuteChain={handleExecuteProjectDetailsOnChain}
      buttonTextOverride={{
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>
      }}
    />
  )
}
