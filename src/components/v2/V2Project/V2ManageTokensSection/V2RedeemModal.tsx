import { t, Trans } from '@lingui/macro'
import { Descriptions, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useWallet } from 'hooks/Wallet'

import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

import Callout from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import TransactionModal from 'components/TransactionModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useETHReceivedFromTokens } from 'hooks/v2/contractReader/ETHReceivedFromTokens'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { useRedeemTokensTx } from 'hooks/v2/transactor/RedeemTokensTx'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2_CURRENCY_USD } from 'utils/v2/currency'
import { formatRedemptionRate } from 'utils/v2/math'

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
  const { userAddress } = useWallet()
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

  const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  const hasRedemptionRate = fundingCycleMetadata.redemptionRate.gt(0)

  const canRedeem = hasOverflow && hasRedemptionRate

  if (canRedeem) {
    modalTitle = t`Redeem ${tokensTextLong} for ETH`
  } else {
    modalTitle = t`Burn ${tokensTextLong}`
  }

  const validateRedeemAmount = () => {
    const redeemBN = parseWad(redeemAmount ?? 0)

    if (redeemBN.eq(0)) {
      return Promise.reject(t`Required`)
    } else if (redeemBN.gt(totalBalance ?? 0)) {
      return Promise.reject(t`Insufficient token balance`)
    } else if (redeemBN.gt(totalTokenSupply ?? 0)) {
      // Error message already showing for this case
      return Promise.reject()
    }
    return Promise.resolve()
  }

  const exectuteRedeemTransaction = async () => {
    await form.validateFields()
    if (!minReturnedTokens) return

    setLoading(true)

    const txSuccess = await redeemTokensTx(
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

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const totalSupplyExceeded =
    redeemAmount &&
    parseFloat(redeemAmount) > parseFloat(fromWad(totalTokenSupply))
  const personalBalanceExceeded =
    redeemAmount && parseFloat(redeemAmount) > parseFloat(fromWad(totalBalance))
  const inUSD = distributionLimitCurrency?.eq(V2_CURRENCY_USD)

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
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          {canRedeem ? (
            <Space direction="vertical" size="middle">
              <Callout>
                <Trans>Tokens are burned when they are redeemed.</Trans>
              </Callout>
              <div>
                <Trans>
                  Redeem your tokens for a portion of this project's overflow.
                  The current funding cycle's <strong>redemption rate</strong>{' '}
                  determines your redemption value.
                </Trans>
              </div>
            </Space>
          ) : (
            <Callout>
              {!hasOverflow && (
                <Trans>
                  <strong>This project has no overflow</strong>. You won't
                  receive any ETH for burning your tokens.
                </Trans>
              )}
              {!hasRedemptionRate && (
                <Trans>
                  <strong>This project has a 0% redemption rate</strong>. You
                  won't receive any ETH for burning your tokens.
                </Trans>
              )}
            </Callout>
          )}
        </div>

        <Descriptions
          column={1}
          contentStyle={{ display: 'block', textAlign: 'right' }}
        >
          <Descriptions.Item label={<Trans>Redemption rate</Trans>}>
            {formatRedemptionRate(fundingCycleMetadata.redemptionRate)}%
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Trans>
                Your{' '}
                {tokenSymbolText({
                  tokenSymbol,
                })}{' '}
                balance
              </Trans>
            }
          >
            {formatWad(totalBalance ?? 0, { precision: 0 })} {tokensTextShort}
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Redemption value</Trans>}>
            <ETHAmount amount={maxClaimable} />
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            <Form.Item
              label={
                canRedeem ? (
                  <Trans>Tokens to redeem</Trans>
                ) : (
                  <Trans>Tokens to burn</Trans>
                )
              }
            >
              <FormattedNumberInput
                name="redeemAmount"
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
            </Form.Item>
          </Form>

          {canRedeem && !totalSupplyExceeded && minReturnedTokens?.gt(0) ? (
            <div style={{ fontWeight: 500, marginTop: 20 }}>
              <>
                {/* If USD denominated, can only define the lower limit (not exact amount), hence 'at least' */}
                {/* Using 4 full sentences for translation purposes */}
                {!personalBalanceExceeded ? (
                  <>
                    {inUSD ? (
                      <Trans>
                        You will receive at least{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    ) : (
                      <Trans>
                        You will receive{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    )}
                  </>
                ) : (
                  <>
                    {inUSD ? (
                      <Trans>
                        You would receive at least{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    ) : (
                      <Trans>
                        You would receive{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    )}
                  </>
                )}
              </>
            </div>
          ) : null}
        </div>
      </Space>
    </TransactionModal>
  )
}
