import { CheckCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { ModalProps, Statistic } from 'antd'
import Loading from 'components/Loading'
import TooltipIcon from 'components/TooltipIcon'
import TransactionModal from 'components/modals/TransactionModal'
import { CV_V2 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import useERC20Allowance from 'hooks/ERC20/useERC20Allowance'
import { useV1ProjectId } from 'hooks/JBV3Token/contractReader/useV1ProjectId'
import { useJBOperatorStoreForV3Token } from 'hooks/JBV3Token/contracts/useJBOperatorStoreForV3Token'
import { useV1TicketBoothForV3Token } from 'hooks/JBV3Token/contracts/useV1TicketBoothForV3Token'
import { useMigrateTokensTx } from 'hooks/JBV3Token/transactor/useMigrateTokensTx'
import { useWallet } from 'hooks/Wallet'
import useTokenAddressOfProject from 'hooks/v1/contractReader/useTokenAddressOfProject'
import { useV1HasPermissions } from 'hooks/v1/contractReader/useV1HasPermissions'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/useV2V3HasPermissions'
import { V1OperatorPermission } from 'models/v1/permissions'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { ApproveMigrationCallout } from './ApproveMigrationCallout'
import { GrantV1ApprovalCallout } from './GrantV1ApprovalCallout'
import { GrantV2ApprovalCallout } from './GrantV2ApprovalCallout'
import { TokenSwapDescription } from './TokenSwapDescription'

export function MigrateLegacyProjectTokensModal({
  legacyTokenBalance,
  v1ClaimedBalance,
  ...props
}: {
  legacyTokenBalance: BigNumber | undefined
  v1ClaimedBalance: BigNumber | undefined
} & ModalProps) {
  const { cvs } = useContext(V2V3ContractsContext)
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { value: v1ProjectId } = useV1ProjectId()
  const { userAddress } = useWallet()
  const v1TokenAddress = useTokenAddressOfProject(v1ProjectId)

  const [loading, setLoading] = useState<boolean>(false)
  const [grantV1PermissionDone, setGrantV1PermissionDone] =
    useState<boolean>(false)
  const [grantV2PermissionDone, setGrantV2PermissionDone] =
    useState<boolean>(false)
  const [approveDone, setApproveDone] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

  const V2JBOperatorStore = useJBOperatorStoreForV3Token()
  const V1TicketBooth = useV1TicketBoothForV3Token()
  const { data: v1Allowance } = useERC20Allowance(
    v1TokenAddress,
    userAddress,
    tokenAddress,
  )
  const migrateTokensTx = useMigrateTokensTx()

  const hasV1Project = Boolean(
    V1TicketBooth && v1ProjectId && !v1ProjectId.eq(0),
  )
  const hasV2Project = cvs?.includes(CV_V2)

  const hasV1TransferPermission =
    useV1HasPermissions({
      operator: tokenAddress,
      account: userAddress,
      domain: v1ProjectId?.toNumber(),
      permissionIndexes: [V1OperatorPermission.Transfer],
    }) || grantV1PermissionDone

  const hasV2TransferPermissionResult = useV2V3HasPermissions({
    operator: tokenAddress,
    account: userAddress,
    domain: projectId,
    permissions: [V2V3OperatorPermission.TRANSFER],
    JBOperatorStore: V2JBOperatorStore,
  })
  const hasV2TransferPermission =
    grantV2PermissionDone || hasV2TransferPermissionResult.data

  const v1MigrationReady =
    !hasV1Project || (hasV1Project && hasV1TransferPermission)
  const v2MigrationReady =
    !hasV2Project || (hasV2Project && hasV2TransferPermission)
  const hasAllTransferPermissions = Boolean(
    v1MigrationReady && v2MigrationReady,
  )

  // Show the V1 callout, then V2 callout (if applicable)
  const showV1GrantPermissionCallout = !v1MigrationReady
  const showV2GrantPermissionCallout =
    !showV1GrantPermissionCallout && !v2MigrationReady

  const hasV1ClaimedBalance = v1ClaimedBalance && v1ClaimedBalance.gt(0)

  const needsV1Approval = hasV1Project && hasV1ClaimedBalance

  const hasV1ApprovedTokenAllowance =
    !needsV1Approval || v1Allowance?.gte(v1ClaimedBalance) || approveDone

  const showV1ApproveCallout =
    !showV1GrantPermissionCallout &&
    !showV2GrantPermissionCallout &&
    !hasV1ApprovedTokenAllowance

  const canMigrate = hasAllTransferPermissions && hasV1ApprovedTokenAllowance

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
      okButtonProps={!canMigrate ? { disabled: true } : undefined}
      {...modalOkProps}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <TokenSwapDescription />

        <div className="flex gap-6">
          <Statistic
            title={
              <>
                <Trans>Your total legacy tokens</Trans>{' '}
                <TooltipIcon
                  tip={
                    <Trans>Total unclaimed and claimed V1 and V2 tokens</Trans>
                  }
                />
              </>
            }
            value={formatWad(legacyTokenBalance, { precision: 4 })}
          />
        </div>

        <div className="flex flex-col gap-2">
          {hasV1Project && hasV1TransferPermission && (
            <div>
              <CheckCircleOutlined /> V1 Transfer permission granted.
            </div>
          )}
          {hasV2Project && hasV2TransferPermission && (
            <div>
              <CheckCircleOutlined /> V2 Transfer permission granted.
            </div>
          )}
          {hasV1Project &&
            v1ClaimedBalance?.gt(0) &&
            hasV1ApprovedTokenAllowance && (
              <div>
                <CheckCircleOutlined /> V1 ERC-20 token spend approved.
              </div>
            )}
        </div>

        {showV1GrantPermissionCallout && (
          <GrantV1ApprovalCallout
            onDone={() => setGrantV1PermissionDone(true)}
          />
        )}
        {showV2GrantPermissionCallout &&
          (hasV2TransferPermissionResult.loading ? (
            <Loading />
          ) : (
            <GrantV2ApprovalCallout
              onDone={() => setGrantV2PermissionDone(true)}
            />
          ))}
        {showV1ApproveCallout && v1ClaimedBalance && (
          <ApproveMigrationCallout
            version="1"
            onDone={() => setApproveDone(true)}
            approveAmount={v1ClaimedBalance}
            legacyTokenContractAddress={v1TokenAddress}
          />
        )}
      </div>
    </TransactionModal>
  )
}
