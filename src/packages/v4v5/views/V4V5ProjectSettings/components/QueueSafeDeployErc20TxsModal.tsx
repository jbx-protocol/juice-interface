import { Trans, t } from '@lingui/macro'
import { FormInstance } from 'antd'
import { JBChainId, createSalt, jbControllerAbi } from 'juice-sdk-core'
import { useJBContractContext, useSuckers } from 'juice-sdk-react'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from 'packages/v4v5/hooks/useProposeSafeTransaction'

import { IssueErc20TokenTxArgs } from 'components/buttons/IssueErc20TokenButton'
import QueueSafeTxsModal from 'packages/v4v5/components/QueueSafeTxsModal'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { getChainName } from 'packages/v4v5/utils/networks'
import { useCallback, useMemo } from 'react'
import { emitInfoNotification } from 'utils/notifications'
import { encodeFunctionData } from 'viem'

export interface QueueSafeDeployErc20TxsModalProps {
  open: boolean
  onCancel: VoidFunction
  onSuccess?: VoidFunction
  form: FormInstance<IssueErc20TokenTxArgs>
}

export default function QueueSafeDeployErc20TxsModal({
  open,
  onCancel,
  onSuccess,
  form,
}: QueueSafeDeployErc20TxsModalProps) {
  const { data: safeAddress } = useV4V5ProjectOwnerOf()
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress: safeAddress || '' })
  const { data: suckers } = useSuckers()
  const { contracts } = useJBContractContext()

  const salt = useMemo(() => createSalt(), [])

  const handleExecuteDeployErc20OnChain = useCallback(async (chainId: JBChainId, signerAddress?: string) => {
    const formValues = form.getFieldsValue()
    if (!formValues.name || !formValues.symbol) throw new Error('Token name and symbol are required')
    if (!safeAddress) throw new Error('Safe address is required')
    if (!suckers) throw new Error('No project chains available')

    const sucker = suckers.find(s => s.peerChainId === chainId)
    if (!sucker) throw new Error(`No project found for chain ${chainId}`)

    const projectId = BigInt(sucker.projectId)

    const data = encodeFunctionData({
      abi: jbControllerAbi,
      functionName: 'deployERC20For',
      args: [projectId, formValues.name, formValues.symbol, salt],
    })

    const result: SafeProposeTransactionResponse = await proposeTransaction({
      to: contracts.controller.data ?? '',
      data,
      value: '0',
      chainId,
      signerAddressOverride: signerAddress,
    })

    emitInfoNotification(
      t`Safe transaction queued on ${getChainName(chainId)}`
    )
    return result
  }, [form, safeAddress, suckers, proposeTransaction, contracts.controller.data, salt])

  return (
    <QueueSafeTxsModal
      open={open}
      onCancel={onCancel}
      onAllComplete={onSuccess}
      title={<Trans>Queue Safe ERC-20 Deploy Transactions</Trans>}
      description={
        <Trans>
          Since your project owner is a Gnosis Safe and this is an omnichain project,
          you need to queue separate ERC-20 deploy transactions on each chain.
        </Trans>
      }
      onExecuteChain={handleExecuteDeployErc20OnChain}
      safeAddress={safeAddress || ''}
      buttonTextOverride={{
        execute: (chainName: string) => <Trans>Queue on {chainName}</Trans>
      }}
    />
  )
}
