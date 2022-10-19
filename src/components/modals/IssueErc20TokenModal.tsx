import { t, Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { CV_V1, CV_V1_1, CV_V2, CV_V3 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV1IssueErc20TokenTx } from 'hooks/v1/transactor/IssueErc20TokenTx'
import { useV2IssueErc20TokenTx } from 'hooks/v2/transactor/V2IssueErc20TokenTx'
import { useV3IssueErc20TokenTx } from 'hooks/v3/transactor/V3IssueErc20TokenTx'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { IssueErc20TokenTxArgs } from '../IssueErc20TokenButton'
import TransactionModal from '../TransactionModal'

/**
 * Return the appropriate issue erc20 token hook for the given contract version [cv].
 * @returns
 */
const useIssueErc20TokenTx = ():
  | TransactorInstance<IssueErc20TokenTxArgs>
  | undefined => {
  const { cv } = useContext(ProjectMetadataContext)

  if (cv === CV_V1 || cv === CV_V1_1) {
    return useV1IssueErc20TokenTx()
  }

  if (cv === CV_V2) {
    return useV2IssueErc20TokenTx()
  }

  if (cv === CV_V3) {
    return useV3IssueErc20TokenTx()
  }
}

export function IssueErc20TokenModal({
  open,
  onClose,
  onConfirmed,
}: {
  open: boolean
  onClose: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<IssueErc20TokenTxArgs>()

  const issueErc20TokenTx = useIssueErc20TokenTx()

  async function executeErc20IssueTokenTx() {
    await form.validateFields()

    if (!issueErc20TokenTx) {
      emitErrorNotification(t`ERC20 transaction not ready. Try again.`)
      return
    }

    setLoading(true)

    const fields = form.getFieldsValue(true)

    const txSuccess = await issueErc20TokenTx(
      { name: fields.name, symbol: fields.symbol },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          onClose()
          onConfirmed?.()
        },
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      emitErrorNotification(
        t`Failed to issue ERC20 token. Check transaction and try again.`,
      )

      setLoading(false)
      setTransactionPending(false)
    }
  }

  return (
    <TransactionModal
      open={open}
      title={t`Issue ERC-20 token`}
      okText={t`Issue token`}
      cancelText={t`Later`}
      connectWalletText={t`Connect wallet to issue`}
      onOk={executeErc20IssueTokenTx}
      onCancel={() => onClose()}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <p>
        <Trans>
          Issue an ERC-20 to be used as this project's token. Once issued,
          anyone can claim their existing token balance in the new token.
        </Trans>
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t`Token name`}
          rules={[{ required: true, message: t`Token name is required` }]}
        >
          <Input placeholder={t`Project Token`} />
        </Form.Item>
        <Form.Item
          name="symbol"
          label={t`Token symbol`}
          rules={[{ required: true, message: t`Token symbol is required` }]}
        >
          <Input
            placeholder="PRJ"
            onChange={e =>
              form.setFieldsValue({ symbol: e.target.value.toUpperCase() })
            }
          />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
