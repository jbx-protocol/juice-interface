import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useUnstakeTokensTx } from 'hooks/v1/transactor/UnstakeTokensTx'
import { useContext, useLayoutEffect, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function ConfirmUnstakeTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [unstakeAmount, setUnstakeAmount] = useState<string>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol, tokenAddress } = useContext(V1ProjectContext)
  const unstakeTokensTx = useUnstakeTokensTx()

  const unclaimedBalance = useUnclaimedBalanceOfUser()

  useLayoutEffect(() => {
    setUnstakeAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  function unstake() {
    if (
      !unstakeAmount ||
      parseWad(unstakeAmount).eq(0) // Disable claiming 0 tokens
    )
      return

    setLoading(true)

    unstakeTokensTx(
      { unstakeAmount: parseWad(unstakeAmount) },
      {
        onDone: () => setLoading(false),
        onConfirmed,
      },
    )
  }

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const tokenTextPlural = tokenSymbolText({ tokenSymbol, plural: true })

  return (
    <Modal
      title={t`Claim ${tokenTextPlural} as ERC-20 tokens`}
      open={open}
      onOk={unstake}
      okText={t`Claim ${tokenTextPlural}`}
      confirmLoading={loading}
      okButtonProps={{ disabled: parseWad(unstakeAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered
    >
      <Space direction="vertical" size="large">
        {!ticketsIssued && (
          <div style={{ padding: 10, background: colors.background.l1 }}>
            <Trans>
              <b>Note:</b> Tokens cannot be claimed because no ERC-20 token has
              been issued for this project. ERC-20 tokens must be issued by the
              project owner.
            </Trans>
          </div>
        )}

        <div>
          <p>
            <Trans>
              Claiming {tokenSymbol} tokens will convert your {tokenSymbol}{' '}
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
              You can still redeem your {tokenSymbol} tokens for overflow
              without claiming them, and you can transfer your unclaimed{' '}
              {tokenSymbol} tokens to another address from the Tools menu, which
              can be accessed from the wrench icon in the upper right hand
              corner of this project.
            </Trans>
          </p>
        </div>

        <div>
          <div>
            <Trans>
              <label>Your unclaimed {tokenSymbol} tokens:</label>{' '}
              {formatWad(unclaimedBalance, { precision: 8 })}
            </Trans>
          </div>
          {ticketsIssued && (
            <div>
              <Trans>
                <label>{tokenSymbol} ERC-20 address:</label>{' '}
                <FormattedAddress address={tokenAddress} />
              </Trans>
            </div>
          )}
        </div>

        <Form layout="vertical">
          <Form.Item label={t`Amount of ERC-20 tokens to claim`}>
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(unclaimedBalance))}
              disabled={!ticketsIssued}
              placeholder="0"
              value={unstakeAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setUnstakeAmount(fromWad(unclaimedBalance))}
                />
              }
              onChange={val => setUnstakeAmount(val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
