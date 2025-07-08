import { Trans, t } from '@lingui/macro'
import { Button, Form, Statistic } from 'antd'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import EthereumAddress from 'components/EthereumAddress'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { useState } from 'react'

export function V4TransferOwnershipForm({
  useTransferProjectOwnershipTx,
  ownerAddress,
}: {
  useTransferProjectOwnershipTx: () => (
    args: { newOwnerAddress: string },
    opts: {
      onTransactionPending?: (hash: string) => void
      onTransactionConfirmed?: () => void
      onTransactionError?: (error: Error) => void
      onConfirmed?: () => void
      onError?: (error: Error) => void
      onDone?: () => void
    }
  ) => Promise<void>
  ownerAddress: string | undefined
}) {
  const transferProjectOwnershipTx = useTransferProjectOwnershipTx()

  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()
  const [transferOwnershipForm] = Form.useForm<{ to: string }>()

  async function transferOwnership() {
    const newOwnerAddress = transferOwnershipForm.getFieldValue('to')
    if (!newOwnerAddress) {
      emitErrorNotification('Please enter a recipient address')
      return
    }

    setLoadingTransferOwnership(true)

    await transferProjectOwnershipTx(
      { newOwnerAddress },
      {
        onTransactionPending: () => {
          // Keep loading state during transaction
        },
        onTransactionConfirmed: () => {
          setLoadingTransferOwnership(false)
          transferOwnershipForm.resetFields()
          emitInfoNotification('Project ownership transferred successfully!')
        },
        onTransactionError: (error: Error) => {
          setLoadingTransferOwnership(false)
          emitErrorNotification(error.message)
        },
        onError: (error: Error) => {
          setLoadingTransferOwnership(false)
          emitErrorNotification(error.message)
        },
        onDone: () => {
          setLoadingTransferOwnership(false)
        },
      }
    )
  }

  return (
    <Form form={transferOwnershipForm} layout="vertical">
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
          <Form.Item name="to" label={t`Recipient address`}>
            <EthAddressInput />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => transferOwnership()}
              loading={loadingTransferOwnership}
              size="small"
              type="primary"
            >
              <span>
                <Trans>Transfer ownership</Trans>
              </span>
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  )
}
