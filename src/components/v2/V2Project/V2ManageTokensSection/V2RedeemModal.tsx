import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { CSSProperties, useContext, useState } from 'react'
import { formatPercent, formatWad, fromWad, parseWad } from 'utils/formatNumber'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { formatRedemptionRate } from 'utils/v2/math'
import CurrencySymbol from 'components/CurrencySymbol'
import { useETHReceivedFromTokens } from 'hooks/v2/contractReader/ETHReceivedFromTokens'
import { V2_CURRENCY_USD } from 'utils/v2/currency'
import { useRedeemTokensTx } from 'hooks/v2/transactor/RedeemTokensTx'
import TransactionModal from 'components/TransactionModal'

const statsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
}

// This doubles as the 'Redeem' and 'Burn' modal depending on if project has overflow
export default function V2RedeemModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)
  const {
    tokenSymbol,
    fundingCycle,
    primaryTerminalCurrentOverflow,
    projectId,
    totalTokenSupply,
    distributionLimitCurrency,
    fundingCycleMetadata,
  } = useContext(V2ProjectContext)

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const maxClaimable = useETHReceivedFromTokens({
    tokenAmount: fromWad(totalBalance),
  })
  const rewardAmount = useETHReceivedFromTokens({ tokenAmount: redeemAmount })
  const redeemTokensTx = useRedeemTokensTx()

  if (!fundingCycle || !fundingCycleMetadata) return null

  const share = formatPercent(totalBalance, totalTokenSupply)

  // 0.5% slippage for USD-denominated projects
  const minReturnedTokens = distributionLimitCurrency?.eq(V2_CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : // ? rewardAmount?.mul(100).div(101)
      rewardAmount

  const tokensTextLong = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })
  const tokensTextShort = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  let modalTitle: string
  // Defining whole sentence for translations
  if (primaryTerminalCurrentOverflow?.gt(0)) {
    modalTitle = t`Redeem ${tokensTextLong} for ETH`
  } else {
    modalTitle = t`Burn ${tokensTextLong}`
  }

  const minReturnedTokensFormatted =
    formatWad(minReturnedTokens, { precision: 8 }) || '--'

  const validateRedeemAmount = () => {
    const redeemBN = parseWad(redeemAmount ?? 0)

    if (redeemBN.eq(0)) {
      return Promise.reject(t`Required`)
    } else if (redeemBN.gt(totalBalance ?? 0)) {
      return Promise.reject(t`Balance exceeded`)
    }
    return Promise.resolve()
  }

  const exectuteRedeemTransaction = async () => {
    await form.validateFields()
    if (!minReturnedTokens) return

    setLoading(true)

    redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minReturnedTokens,
      },
      {
        // step 1
        onDone: () => {
          setTransactionPending(true)
          setRedeemAmount(undefined)
        },
        // step 2
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          onConfirmed?.()
        },
      },
    )
  }

  return (
    <TransactionModal
      transactionPending={transactionPending}
      title={modalTitle}
      visible={visible}
      confirmLoading={loading}
      onOk={() => {
        exectuteRedeemTransaction()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        onCancel?.()
      }}
      okText={modalTitle}
      okButtonProps={{
        disabled: !redeemAmount || parseInt(redeemAmount) === 0,
      }}
      width={540}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <p style={statsStyle}>
            <Trans>
              Redemption rate:{' '}
              <span>
                {formatRedemptionRate(fundingCycleMetadata.redemptionRate)}%
              </span>
            </Trans>
          </p>
          <p style={statsStyle}>
            <Trans>
              {tokenSymbolText({ tokenSymbol: tokenSymbol, capitalize: true })}{' '}
              balance:{' '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  {formatWad(totalBalance ?? 0, { precision: 0 })}{' '}
                  {tokensTextShort}
                </div>
                <div
                  style={{
                    cursor: 'default',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: colors.text.tertiary,
                  }}
                >
                  ({share}% of supply)
                </div>
              </div>
            </Trans>
          </p>
          <p style={statsStyle}>
            <Trans>
              Currently worth:{' '}
              <span>
                <CurrencySymbol currency="ETH" />
                {formatWad(maxClaimable, { precision: 4 })}
              </span>
            </Trans>
          </p>
        </div>
        <p>
          {primaryTerminalCurrentOverflow?.gt(0) ? (
            <Trans>
              Tokens can be redeemed for a portion of this project's ETH
              overflow, according to the redemption rate of the current funding
              cycle.{' '}
              <span style={{ fontWeight: 500, color: colors.text.warn }}>
                Tokens are burned when they are redeemed.
              </span>
            </Trans>
          ) : (
            <span style={{ fontWeight: 500, color: colors.text.warn }}>
              <Trans>
                <strong>This project has no overflow</strong>, so you will not
                receive any ETH for burning tokens.
              </Trans>
            </span>
          )}
        </p>
        <div>
          <Form form={form}>
            <FormattedNumberInput
              min={0}
              step={0.001}
              placeholder="0"
              value={redeemAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setRedeemAmount(fromWad(totalBalance))}
                />
              }
              formItemProps={{
                rules: [{ validator: validateRedeemAmount }],
              }}
              disabled={totalBalance?.eq(0)}
              onChange={val => setRedeemAmount(val)}
            />
          </Form>
          {primaryTerminalCurrentOverflow?.gt(0) ? (
            <div style={{ fontWeight: 500, marginTop: 20 }}>
              {distributionLimitCurrency?.eq(V2_CURRENCY_USD) ? (
                <Trans>
                  You will receive minimum {minReturnedTokensFormatted} ETH
                </Trans>
              ) : (
                <Trans>You will receive {minReturnedTokensFormatted} ETH</Trans>
              )}
            </div>
          ) : null}
        </div>
      </Space>
    </TransactionModal>
  )
}
