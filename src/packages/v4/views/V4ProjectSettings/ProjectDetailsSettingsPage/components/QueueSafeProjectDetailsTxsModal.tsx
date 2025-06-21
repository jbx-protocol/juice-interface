import { Trans, t } from '@lingui/macro'
import { FormInstance, useWatch } from 'antd/lib/form/Form'
import { JBChainId, JBProjectMetadata, jbControllerAbi, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from 'packages/v4/hooks/useProposeSafeTransaction'

import { ProjectDetailsFormFields } from 'components/Project/ProjectSettings/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { useSuckers } from 'juice-sdk-react'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import QueueSafeTxsModal from 'packages/v4/components/QueueSafeTxsModal'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { getChainName } from 'packages/v4/utils/networks'
import { useCallback } from 'react'
import { emitInfoNotification } from 'utils/notifications'
import { encodeFunctionData } from 'viem'

export interface QueueSafeProjectDetailsTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  form?: FormInstance<ProjectDetailsFormFields>
  projectMetadata?: JBProjectMetadata
  safeAddress: string
}
export default function QueueSafeProjectDetailsTxsModal({
  open,
  onCancel,
  form,
  projectMetadata,
}: QueueSafeProjectDetailsTxsModalProps) {
  const {data: safeAddress} = useV4ProjectOwnerOf()
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress: safeAddress || '' })
  const { data: suckers } = useSuckers()
  const formData = useWatch([], form) as ProjectDetailsFormFields | undefined

  const handleExecuteProjectDetailsOnChain = useCallback(async (chainId: JBChainId) => {
    if (!formData) throw new Error('Form data is required')
    if (!safeAddress) throw new Error('Safe address is required')
    if (!suckers) throw new Error('No project chains available')

    // Find the sucker for this specific chain to get the correct project ID
    const sucker = suckers.find(s => s.peerChainId === chainId)
    if (!sucker) throw new Error(`No project found for chain ${chainId}`)

    // 1. Upload metadata
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
    if (!uploadedMetadata.Hash) throw new Error('Failed to upload metadata')
    const hash = uploadedMetadata.Hash as `0x${string}`

    // 2. Prepare chain-specific transaction data
    const projectId = BigInt(sucker.projectId)
    const controllerAddress = jbProjectDeploymentAddresses.JBController[chainId] as `0x${string}`
    
    const data = encodeFunctionData({
      abi: jbControllerAbi,
      functionName: 'setUriOf',
      args: [projectId, hash],
    })

    // 3. Propose the transaction to the Safe service
    const result: SafeProposeTransactionResponse = await proposeTransaction({
      to: controllerAddress,
      data,
      value: '0',
      chainId
    })
    
    emitInfoNotification(
        t`Safe transaction queued on ${getChainName(chainId)}`
    )
    return result
  }, [formData, projectMetadata, safeAddress, suckers, proposeTransaction])

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      title={<Trans>Queue Safe Project Details Transactions</Trans>}
      description={
        <Trans>
          Since your project owner is a Gnosis Safe and this is an omnichain project,
          you need to queue separate transactions on each chain.
        </Trans>
      }
      onExecuteChain={handleExecuteProjectDetailsOnChain}
      safeAddress={safeAddress || ''}
      buttonTextOverride={{
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>
      }}
    />
  )
}
