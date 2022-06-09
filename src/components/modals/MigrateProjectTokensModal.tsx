import { Trans } from '@lingui/macro'
import { Button, Form, Input, ModalProps, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { NetworkContext } from 'contexts/networkContext'
import { usePayV1TokenPaymentTerminal } from 'hooks/v2/transactor/PayV1TokenPaymentTerminal'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formattedNum, parseWad } from 'utils/formatNumber'
import { useSetOperatorTx } from 'hooks/v1/transactor/SetOperatorTx'
import { emitErrorNotification } from 'utils/notifications'
import {
  useHasPermissions as useHasPermissionV1,
  OperatorPermission,
} from 'hooks/v1/contractReader/HasPermission'
import Callout from 'components/Callout'

import { MinimalCollapse } from '../MinimalCollapse'
import { readNetwork } from 'constants/networks'
import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'

export function MigrateProjectTokensModal({
  v1TokenSymbol,
  v1TokenBalance,
  v1ProjectHandle,
  v2ProjectName,
  ...props
}: {
  v1TokenSymbol?: string
  v1TokenBalance: number
  v1ProjectHandle: string
  v2ProjectName: string
} & ModalProps) {
  const [tokenAmount, setTokenAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [setPermissionLoading, setSetPermissionLoading] =
    useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

  const { userAddress } = useContext(NetworkContext)

  const payV1TokenPaymentTerminalTx = usePayV1TokenPaymentTerminal()
  const setV1OperatorTx = useSetOperatorTx()

  const operator = JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]

  const hasV1TokenTransferPermission = useHasPermissionV1({
    operator,
    domain: 0,
    account: userAddress,
    permissionIndexes: [OperatorPermission.Transfer],
  })

  const swapTokens = async () => {
    setLoading(true)

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

  const onGivePermissionClick = async () => {
    setSetPermissionLoading(true)

    const operator = JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]
    if (!operator) return

    try {
      const res = await setV1OperatorTx({
        operator,
        domain: 0,
        permissionIndexes: [OperatorPermission.Transfer],
      })

      if (!res) {
        throw new Error()
      }
    } catch (e) {
      emitErrorNotification('Set permission failed.')
    } finally {
      setSetPermissionLoading(false)
    }
  }

  const tokenSymbolFormattedPlural = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
    plural: v1TokenBalance !== 1,
  })
  const tokenSymbolFormatted = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
  })

  const modalOkProps = () => {
    return !hasV1TokenTransferPermission
      ? {
          okButtonProps: { hidden: true },
        }
      : {
          onOk: () => swapTokens(),
          okText: (
            <span>
              <Trans>Swap V1 {tokenSymbolFormattedPlural}</Trans>
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
      confirmLoading={loading || setPermissionLoading}
      {...modalOkProps()}
      {...props}
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <div>
          <p style={{ marginBottom: '0.5rem' }}>
            <Trans>
              You have <span style={{ fontWeight: 600 }}>{v2ProjectName}</span>{' '}
              tokens on <Link to={`/p/${v1ProjectHandle}`}>Juicebox V1</Link>.
              You can swap your{' '}
              <span style={{ fontWeight: 600 }}>{v2ProjectName}</span> V1 tokens
              for V2 tokens.
            </Trans>
          </p>

          <MinimalCollapse
            header={<Trans>Do I need to swap my V1 tokens?</Trans>}
          >
            Maybe.
          </MinimalCollapse>
        </div>

        {hasV1TokenTransferPermission ? (
          <Form layout="vertical">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <span>
                <Trans>Your V1 {tokenSymbolFormatted} balance:</Trans>
              </span>
              <span>
                {formattedNum(v1TokenBalance)} {tokenSymbolFormattedPlural}
              </span>
            </div>

            <Form.Item label={<Trans>Tokens to migrate</Trans>}>
              <Input
                onChange={e => {
                  setTokenAmount(parseInt(e.target.value))
                }}
                value={tokenAmount}
                type="number"
                suffix={`V1 ${tokenSymbolFormattedPlural}`}
              ></Input>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <Callout>
              <p>You must give permission to swap your tokens.</p>
              <Button
                loading={setPermissionLoading}
                onClick={() => onGivePermissionClick()}
                type="primary"
              >
                Give permission
              </Button>
            </Callout>
          </div>
        )}
      </Space>
    </TransactionModal>
  )
}
