import { useWallet } from 'hooks/Wallet'
import { Trans } from '@lingui/macro'
import { Form, ModalProps, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { usePayV1TokenPaymentTerminal } from 'hooks/v2/transactor/PayV1TokenPaymentTerminal'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { parseWad } from 'utils/formatNumber'

import { useV1HasPermissions } from 'hooks/v1/contractReader/V1HasPermissions'
import { V1OperatorPermission } from 'models/v1/permissions'
import { V2UserContext } from 'contexts/v2/userContext'

import { GrantTransferPermissionCallout } from './GrantTransferPermissionCallout'
import { TokenSwapDescription } from './TokenSwapDescription'
import { MigrateV1ProjectTokensForm } from './MigrateV1ProjectTokensForm'

export function MigrateProjectTokensModal({
  v1TokenSymbol,
  v1TokenBalance,
  v1ProjectHandle,
  ...props
}: {
  v1TokenSymbol?: string
  v1TokenBalance: number
  v1ProjectHandle: string
} & ModalProps) {
  const { userAddress } = useWallet()
  const { contracts } = useContext(V2UserContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  const [form] = Form.useForm<{ tokenAmount: string }>()

  const operator = contracts?.JBV1TokenPaymentTerminal.address
  const hasV1TokenTransferPermission =
    useV1HasPermissions({
      operator,
      domain: 0,
      account: userAddress,
      permissionIndexes: [V1OperatorPermission.Transfer],
    }) || permissionGranted
  const payV1TokenPaymentTerminalTx = usePayV1TokenPaymentTerminal()

  const swapTokens = async () => {
    setLoading(true)

    const tokenAmount = form.getFieldValue('tokenAmount')

    const txSuccess = await payV1TokenPaymentTerminalTx(
      {
        memo: '',
        preferClaimedTokens: false,
        beneficiary: userAddress,
        value: parseWad(tokenAmount),
      },
      {
        onConfirmed() {
          setLoading(false)
          setTransactionPending(false)

          window.location.reload()
        },
        onDone() {
          setTransactionPending(true)
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  const tokenSymbolFormattedPlural = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
    plural: v1TokenBalance !== 1,
  })

  const modalOkProps = () => {
    return !hasV1TokenTransferPermission
      ? {
          okButtonProps: { hidden: true },
        }
      : {
          onOk: () => form.submit(),
          okText: (
            <span>
              <Trans>Swap for V2 {tokenSymbolFormattedPlural}</Trans>
            </span>
          ),
        }
  }

  return (
    <TransactionModal
      title={
        <Trans>
          Swap V1 {tokenSymbolFormattedPlural} for V2{' '}
          {tokenSymbolFormattedPlural}
        </Trans>
      }
      transactionPending={transactionPending}
      confirmLoading={loading}
      destroyOnClose
      {...modalOkProps()}
      {...props}
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        {!hasV1TokenTransferPermission && (
          <GrantTransferPermissionCallout
            onFinish={() => setPermissionGranted(true)}
          />
        )}
        <TokenSwapDescription v1ProjectHandle={v1ProjectHandle} />

        {hasV1TokenTransferPermission && (
          <MigrateV1ProjectTokensForm
            form={form}
            onFinish={() => swapTokens()}
            v1TokenSymbol={v1TokenSymbol}
            v1TokenBalance={v1TokenBalance}
          />
        )}
      </Space>
    </TransactionModal>
  )
}
