import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'

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
      },
    )
  }

  return (
    <Form form={transferOwnershipForm} layout="vertical">
      <h3>
        <Trans>Transfer ownership</Trans>
      </h3>
      <p>
        <Trans>Current owner: {ownerAddress}</Trans>
      </p>

      <FormItems.EthAddress
        name="to"
        defaultValue={undefined}
        onAddressChange={to => transferOwnershipForm.setFieldsValue({ to })}
        formItemProps={{ label: <Trans>Recipient address</Trans> }}
      />

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
    </Form>
  )
}
