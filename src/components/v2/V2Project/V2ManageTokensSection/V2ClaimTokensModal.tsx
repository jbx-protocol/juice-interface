import { WarningOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Form, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/TransactionModal'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useClaimTokensTx } from 'hooks/v2/transactor/ClaimTokensTx'
import { useContext, useLayoutEffect, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function V2ClaimTokensModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [claimAmount, setClaimAmount] = useState<string>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol, tokenAddress } = useContext(V2ProjectContext)
  const claimTokensTx = useClaimTokensTx()

  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()

  useLayoutEffect(() => {
    setClaimAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  function executeClaimTokensTx() {
    if (
      !claimAmount ||
      parseWad(claimAmount).eq(0) // Disable claiming 0 tokens
    )
      return

    setLoading(true)

    claimTokensTx(
      { claimAmount: parseWad(claimAmount) },
      {
        onDone: () => {
          setTransactionPending(true)
          setLoading(false)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          onConfirmed?.()
        },
      },
    )
  }

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const tokenTextLong = tokenSymbolText({
    tokenSymbol,
    plural: true,
    includeTokenWord: true,
  })

  const tokenTextShort = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  return (
    <TransactionModal
      title={t`Claim ${tokenTextShort} as ERC-20 tokens`}
      connectWalletText={t`Connect wallet to claim`}
      visible={visible}
      onOk={executeClaimTokensTx}
      okText={t`Claim ${tokenTextShort}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      okButtonProps={{ disabled: parseWad(claimAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered
    >
      <Space direction="vertical" size="large">
        {!ticketsIssued && (
          <div style={{ padding: 10, background: colors.background.l1 }}>
            <WarningOutlined />{' '}
            <Trans>
              Tokens cannot be claimed because no ERC-20 token has been issued
              for this project. ERC-20 tokens must be issued by the project
              owner.
            </Trans>
          </div>
        )}

        <div>
          <p>
            <Trans>
              Claiming {tokenTextLong} will convert your {tokenTextShort}{' '}
              balance to ERC-20 tokens and mint them to your wallet.
            </Trans>
          </p>
          <p style={{ fontWeight: 600 }}>
            <Trans>
              If you're unsure if you need to claim, you probably don't.
            </Trans>
          </p>
          <p>
            <Trans>
              You can redeem your {tokenTextLong} for overflow without claiming
              them. You can transfer your unclaimed {tokenTextLong} to another
              address from the Tools menu, which can be accessed from the wrench
              icon in the upper right hand corner of this project.
            </Trans>
          </p>
        </div>

        <Descriptions size="small" layout="horizontal" column={1}>
          <Descriptions.Item
            label={<Trans>Your unclaimed {tokenTextLong}</Trans>}
          >
            {formatWad(unclaimedBalance, { precision: 8 })}
          </Descriptions.Item>

          {ticketsIssued && tokenSymbol && (
            <Descriptions.Item
              label={<Trans>{tokenSymbol} ERC-20 address</Trans>}
            >
              <FormattedAddress address={tokenAddress} />
            </Descriptions.Item>
          )}
        </Descriptions>

        <Form layout="vertical">
          <Form.Item label={t`Amount of ERC-20 tokens to claim`}>
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(unclaimedBalance))}
              disabled={!ticketsIssued}
              placeholder="0"
              value={claimAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setClaimAmount(fromWad(unclaimedBalance))}
                />
              }
              onChange={val => setClaimAmount(val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </TransactionModal>
  )
}
