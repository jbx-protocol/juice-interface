import { t, Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV1IssueErc20TokenTx } from 'hooks/v1/transactor/IssueErc20TokenTx'
import { useV2IssueErc20TokenTx } from 'hooks/v2/transactor/V2IssueErc20TokenTx'
import { useV3IssueErc20TokenTx } from 'hooks/v3/transactor/V3IssueErc20TokenTx'
import { V1TerminalVersion } from 'models/v1/terminals'
import { CV2V3 } from 'models/v2v3/cv'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

import { IssueErc20TokenTxArgs } from '../IssueErc20TokenButton'
import TransactionModal from '../TransactionModal'

/**
 * Return the appropriate issue erc20 token hook for the given project version [pv].
 * @returns
 */
const useIssueErc20TokenTx = ():
  | TransactorInstance<IssueErc20TokenTxArgs>
  | undefined => {
  const { cv } = useContext(V2V3ContractsContext)

  const v1Tx = useV1IssueErc20TokenTx()
  const v2Tx = useV2IssueErc20TokenTx()
  const v3Tx = useV3IssueErc20TokenTx()

  if (cv === CV_V2) {
    return v2Tx
  } else if (cv === CV_V3) {
    return v3Tx
  } else {
    return v1Tx
  }
}

export function IssueErc20TokenModal({
  cv,
  open,
  onClose,
  onConfirmed,
}: {
  cv: CV2V3 | V1TerminalVersion
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
