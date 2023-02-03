import { Trans } from '@lingui/macro'
import { Form, ModalProps, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { useContext, useState } from 'react'
import { MigrateLegacyProjectTokensForm } from './MigrateLegacyProjectTokensForm'
import { TokenSwapDescription } from './TokenSwapDescription'
import { useMigrateTokensTx } from 'hooks/JBV3Token/transactor/MigrateTokensTx'
import { BigNumber } from '@ethersproject/bignumber'
import { GrantV2ApprovalCallout } from './GrantV2ApprovalCallout'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/V2V3HasPermissions'
import { useJBOperatorStoreForV3Token } from 'hooks/JBV3Token/contracts/JBOperatorStoreForV3Token'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
// import { GrantV1ApprovalCallout } from './GrantV1ApprovalCallout'

export function MigrateLegacyProjectTokensModal({
  legacyTokenBalance,
  ...props
}: { legacyTokenBalance: BigNumber | undefined } & ModalProps) {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const [form] = Form.useForm()

  const V2JBOperatorStore = useJBOperatorStoreForV3Token()

  const hasV2TransferPermission = useV2V3HasPermissions({
    operator: tokenAddress,
    account: userAddress,
    domain: projectId,
    permissions: [V2V3OperatorPermission.TRANSFER],
    JBOperatorStore: V2JBOperatorStore,
  })

  const hasAllPermissions = hasV2TransferPermission

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

  const modalOkProps = {
    onOk: () => migrateTokens(),
    okText: (
      <span>
        <Trans>Migrate all approved tokens</Trans>
      </span>
    ),
  }

  return (
    <TransactionModal
      title={<Trans>Migrate legacy tokens</Trans>}
      transactionPending={transactionPending}
      confirmLoading={loading}
      destroyOnClose
      okButtonProps={!hasAllPermissions ? { hidden: true } : undefined}
      {...modalOkProps}
      {...props}
    >
      <Space size="large" direction="vertical" className="w-full">
        <TokenSwapDescription />

        {/* <GrantV1ApprovalCallout /> */}
        {!hasV2TransferPermission && <GrantV2ApprovalCallout />}

        <MigrateLegacyProjectTokensForm
          form={form}
          legacyTokenBalance={legacyTokenBalance}
          disabled={!hasAllPermissions}
        />
      </Space>
    </TransactionModal>
  )
}
