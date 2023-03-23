import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Form, ModalProps, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useV1ProjectId } from 'hooks/JBV3Token/contractReader/V1ProjectId'
import { useJBOperatorStoreForV3Token } from 'hooks/JBV3Token/contracts/JBOperatorStoreForV3Token'
import { useV1TicketBoothForV3Token } from 'hooks/JBV3Token/contracts/V1TicketBoothForV3Token'
import { useMigrateTokensTx } from 'hooks/JBV3Token/transactor/MigrateTokensTx'
import { useV1HasPermissions } from 'hooks/v1/contractReader/V1HasPermissions'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/V2V3HasPermissions'
import { useWallet } from 'hooks/Wallet'
import { V1OperatorPermission } from 'models/v1/permissions'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import { GrantV1ApprovalCallout } from './GrantV1ApprovalCallout'
import { GrantV2ApprovalCallout } from './GrantV2ApprovalCallout'
import { MigrateLegacyProjectTokensForm } from './MigrateLegacyProjectTokensForm'
import { TokenSwapDescription } from './TokenSwapDescription'

export function MigrateLegacyProjectTokensModal({
  legacyTokenBalance,
  ...props
}: { legacyTokenBalance: BigNumber | undefined } & ModalProps) {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { value: v1ProjectId } = useV1ProjectId()
  const { userAddress } = useWallet()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const [form] = Form.useForm()

  const V2JBOperatorStore = useJBOperatorStoreForV3Token()
  const V1TicketBooth = useV1TicketBoothForV3Token()

  const hasV1Permission =
    !V1TicketBooth ||
    !v1ProjectId ||
    !v1ProjectId.eq(0) ||
    useV1HasPermissions({
      operator: tokenAddress,
      account: userAddress,
      domain: v1ProjectId?.toNumber(),
      permissionIndexes: [V1OperatorPermission.Transfer],
    })

  const { data: hasV2TransferPermission } = useV2V3HasPermissions({
    operator: tokenAddress,
    account: userAddress,
    domain: projectId,
    permissions: [V2V3OperatorPermission.TRANSFER],
    JBOperatorStore: V2JBOperatorStore,
  })

  const hasAllPermissions = Boolean(hasV2TransferPermission && hasV1Permission)

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

        {!hasV1Permission && <GrantV1ApprovalCallout />}
        {hasV1Permission && !hasV2TransferPermission && (
          <GrantV2ApprovalCallout />
        )}

        <MigrateLegacyProjectTokensForm
          form={form}
          legacyTokenBalance={legacyTokenBalance}
          disabled={!hasAllPermissions}
        />
      </Space>
    </TransactionModal>
  )
}
