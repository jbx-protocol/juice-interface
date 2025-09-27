import { Trans, t } from '@lingui/macro'
import { Button, Form, Statistic } from 'antd'
import { useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import EthereumAddress from 'components/EthereumAddress'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import TransactionModal from 'components/modals/TransactionModal'
import { JBChainId } from 'juice-sdk-core'
import { useSuckers } from 'juice-sdk-react'
import QueueTransferOwnershipTxsModal from 'packages/v4v5/components/QueueTransferOwnershipTxsModal'
import { useTransferOwnershipOnChain } from 'packages/v4v5/hooks/useTransferOwnershipOnChain'
import { useTransferProjectOwnershipTx } from 'packages/v4v5/hooks/useTransferProjectOwnershipTx'
import { Address } from 'viem'

export function V4OmnichainTransferOwnershipForm({
  ownerAddress,
}: {
  ownerAddress: string | undefined
}) {
  const [form] = Form.useForm<{ to: string }>()
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false)
  const [loadingTransferOwnership, setLoadingTransferOwnership] = useState<boolean>()
  const [queueSafeModalOpen, setQueueSafeModalOpen] = useState<boolean>(false)
  
  // Single chain transfer
  const transferProjectOwnershipTx = useTransferProjectOwnershipTx()
  
  // Multi-chain transfer
  const { transferOwnershipOnChain } = useTransferOwnershipOnChain()
  
  const { data: suckers } = useSuckers()

  const chainIds = useMemo(
    () => suckers?.map(s => s.peerChainId) ?? [],
    [suckers]
  )

  async function transferOwnership() {
    const newOwnerAddress = form.getFieldValue('to')
    if (!newOwnerAddress) {
      emitErrorNotification('Please enter a recipient address')
      return
    }

    setLoadingTransferOwnership(true)

    await transferProjectOwnershipTx(
      { newOwnerAddress },
      {
        onTransactionPending: () => {
          setTransactionModalOpen(true)
        },
        onTransactionConfirmed: () => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          form.resetFields()
          emitInfoNotification('Project ownership transferred successfully!')
        },
        onTransactionError: (error: Error) => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          emitErrorNotification(error.message)
        },
        onError: (error: Error) => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          emitErrorNotification(error.message)
        },
        onDone: () => {
          setLoadingTransferOwnership(false)
        },
      }
    )
  }

  function handleTransferOnAllChains() {
    const newOwnerAddress = form.getFieldValue('to')
    if (!newOwnerAddress) {
      emitErrorNotification('Please enter a recipient address')
      return
    }
    if (!ownerAddress) {
      emitErrorNotification('Current owner address not found')
      return
    }
    
    setQueueSafeModalOpen(true)
  }

  const isMultiChain = suckers && suckers.length > 1

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="flex flex-col gap-6">
          <Statistic
            title={<Trans>Current owner</Trans>}
            valueRender={() => (
              <span>
                <EthereumAddress address={ownerAddress} />
              </span>
            )}
          />
          <div>
            <div className="mb-2 text-sm text-grey-600 dark:text-grey-400">
              <Trans>Ensure this address exists on all chains where your project is deployed</Trans>
            </div>
            <Form.Item 
              name="to" 
              label={t`Recipient address`}
              rules={[{ required: true, message: t`Recipient address is required` }]}
            >
              <EthAddressInput />
            </Form.Item>
          </div>
        </div>
      </Form>

      {isMultiChain ? (
        <>
          <p className="mt-4">
            <Trans>Transfer ownership of this project on all chains where it exists. This action will transfer ownership on each of your project's chains separately.</Trans>
          </p>
          <div className="mt-8">
            <Button 
              type="primary" 
              onClick={handleTransferOnAllChains}
            >
              <Trans>Transfer ownership on all chains</Trans>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <Button
            onClick={transferOwnership}
            loading={loadingTransferOwnership}
            type="primary"
          >
            <Trans>Transfer ownership</Trans>
          </Button>
        </div>
      )}

      <TransactionModal
        transactionPending={loadingTransferOwnership}
        title={t`Transfer Project Ownership`}
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        onOk={() => setTransactionModalOpen(false)}
        confirmLoading={loadingTransferOwnership}
        centered
      />

      <QueueTransferOwnershipTxsModal
        open={queueSafeModalOpen}
        onCancel={() => setQueueSafeModalOpen(false)}
        title={<Trans>Transfer Ownership on All Chains</Trans>}
        description={
          <Trans>
            Transfer project ownership on each chain where your project exists. The system will automatically detect the current owner on each chain and transfer accordingly. You'll need to confirm each transaction separately.
          </Trans>
        }
        onExecuteChain={async (chainId: JBChainId) => {
          const toAddress = form.getFieldValue('to') as Address
          return await transferOwnershipOnChain(chainId, ownerAddress as Address, toAddress)
        }}
        fromAddress={ownerAddress as Address}
        toAddress={form.getFieldValue('to') as Address}
        onTxComplete={(chainId: JBChainId, txHash: string) => {
          emitInfoNotification('Ownership transferred successfully!')
        }}
        onAllComplete={() => {
          setQueueSafeModalOpen(false)
          form.resetFields()
          emitInfoNotification('Project ownership transferred successfully on all chains!')
        }}
      />
    </>
  )
}
