import { Trans } from '@lingui/macro'
import { Form, ModalProps, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { useState } from 'react'
import { MigrateLegacyProjectTokensForm } from './MigrateLegacyProjectTokensForm'
import { TokenSwapDescription } from './TokenSwapDescription'
import { useMigrateTokensTx } from 'hooks/JBV3Token/transactor/MigrateTokensTx'
import { BigNumber } from '@ethersproject/bignumber'
import { GrantPermissionSection } from './GrantPermissionSection'

export function MigrateLegacyProjectTokensModal({
  legacyTokenBalance,
  ...props
}: { legacyTokenBalance: BigNumber | undefined } & ModalProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

  const [form] = Form.useForm()

  const migrateTokensTx = useMigrateTokensTx()

  const migrateTokens = async () => {
    setLoading(true)

    const txSuccess = await migrateTokensTx(undefined, {
      onConfirmed() {
        setLoading(false)
        setTransactionPending(false)

        window.location.reload()
      },
      onDone() {
        setTransactionPending(true)
      },
    })

    if (!txSuccess) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  const modalOkProps = () => {
    return {
      onOk: () => migrateTokens(),
      okText: (
        <span>
          <Trans>Swap for V3 tokens</Trans>
        </span>
      ),
    }
  }

  return (
    <TransactionModal
      title={<Trans>Migrate legacy tokens</Trans>}
      transactionPending={transactionPending}
      confirmLoading={loading}
      destroyOnClose
      {...modalOkProps()}
      {...props}
    >
      <Space size="large" direction="vertical" className="w-full">
        <TokenSwapDescription />
        <GrantPermissionSection />

        <MigrateLegacyProjectTokensForm
          form={form}
          legacyTokenBalance={legacyTokenBalance}
        />
      </Space>
    </TransactionModal>
  )
}
