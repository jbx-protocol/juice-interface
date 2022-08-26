import { t, Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function TransferOwnershipForm() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)

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
        onError: (error: DOMException) => {
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
      <h3>
        <Trans>Transfer ownership</Trans>
      </h3>
      <p>
        <Trans>Current owner: {projectOwnerAddress}</Trans>
      </p>
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
    </Form>
  )
}
