import { t, Trans } from '@lingui/macro'
import { Button, Form, Space, Statistic } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function TransferOwnershipForm({
  useTransferProjectOwnershipTx,
  ownerAddress,
}: {
  useTransferProjectOwnershipTx: () => TransactorInstance<{
    newOwnerAddress: string
  }>
  ownerAddress: string | undefined
}) {
  const transferProjectOwnershipTx = useTransferProjectOwnershipTx()

  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()
  const [transferOwnershipForm] = Form.useForm<{ to: string }>()

  function transferOwnership() {
    setLoadingTransferOwnership(true)

    transferProjectOwnershipTx(
      { newOwnerAddress: transferOwnershipForm.getFieldValue('to') },
      {
        onConfirmed: () => {
          setLoadingTransferOwnership(false)
          transferOwnershipForm.resetFields()
        },
        onError: (error: Error) => {
          setLoadingTransferOwnership(false)
          emitErrorNotification(error.message)
        },
        onDone: () => {
          setLoadingTransferOwnership(false)
        },
      },
    )
  }

  return (
    <Form form={transferOwnershipForm} layout="vertical">
      <Space direction="vertical" size="large">
        <Statistic
          title={<Trans>Current owner</Trans>}
          valueRender={() => (
            <span style={{}}>
              <FormattedAddress address={ownerAddress} />
            </span>
          )}
        />
        <div>
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
      </Space>
    </Form>
  )
}
