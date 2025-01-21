import { t, Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Checkbox, Descriptions, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { TokenAmount } from 'components/TokenAmount'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { formatEther, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRulesetContext,
  useJBTokenContext,
  useNativeTokenSurplus,
  useWriteJbControllerBurnTokensOf,
  useWriteJbMultiTerminalCashOutTokensOf,
} from 'juice-sdk-react'
import { useV4UserTotalTokensBalance } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import { useETHReceivedFromTokens } from 'packages/v4/hooks/useETHReceivedFromTokens'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4TotalTokenSupply } from 'packages/v4/hooks/useV4TotalTokenSupply'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { parseEther } from 'viem'

// This doubles as the 'Redeem' and 'Burn' modal depending on if project has overflow
export function V4BurnOrRedeemModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = React.useContext(TxHistoryContext)
  const { token } = useJBTokenContext()
  const { userAddress } = useWallet()
  const payoutLimitResult = usePayoutLimit()
  const payoutLimit = payoutLimitResult.data.amount ?? 0n
  const surplusResult = useNativeTokenSurplus()
  const totalTokenSupplyResult = useV4TotalTokenSupply()
  const rulesetMetadata = useJBRulesetContext().rulesetMetadata.data
  const userTokenBalance = useV4UserTotalTokensBalance().data ?? 0n

  const { writeContractAsync: writeRedeem } =
    useWriteJbMultiTerminalCashOutTokensOf()
  const { writeContractAsync: writeBurnTokens } =
    useWriteJbControllerBurnTokensOf()

  const [form] = useForm<{
    redeemAmount: string | undefined
    legalCheckbox: boolean
  }>()
  const checkedLegal = Form.useWatch('legalCheckbox', form)
  const redeemAmount = Form.useWatch('redeemAmount', form)

  const redeemAmountBigInt = React.useMemo(
    () => parseEther(redeemAmount ?? '0'),
    [redeemAmount],
  )
  const [loading, setLoading] = useState<boolean>()
  const [memo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const maxClaimable = useETHReceivedFromTokens(userTokenBalance) ?? 0n
  const rewardAmount = useETHReceivedFromTokens(redeemAmountBigInt) ?? 0n

  const surplus = React.useMemo(
    () => surplusResult.data ?? 0n,
    [surplusResult.data],
  )
  const redemptionEnabled = React.useMemo(
    () => payoutLimit !== MAX_PAYOUT_LIMIT,
    [payoutLimit],
  )
  const hasSurplus = React.useMemo(() => surplus > 0n, [surplus])
  const canRedeem = React.useMemo(
    () => hasSurplus && redemptionEnabled,
    [hasSurplus, redemptionEnabled],
  )

  const totalSupplyExceeded = React.useMemo(() => {
    if (!redeemAmount) return
    return parseEther(redeemAmount) > (totalTokenSupplyResult.data ?? 0n)
  }, [redeemAmount, totalTokenSupplyResult.data])

  const personalBalanceExceeded = React.useMemo(() => {
    if (!redeemAmount) return
    return parseEther(redeemAmount) > userTokenBalance
  }, [redeemAmount, userTokenBalance])

  const inUsd = React.useMemo(
    () => payoutLimitResult.data.currency === V4_CURRENCY_USD,
    [payoutLimitResult.data.currency],
  )

  const totalTokenSupply = totalTokenSupplyResult.data ?? 0n
  // 0.5% slippage for USD-denominated projects
  const minReturnedTokens =
    payoutLimitResult.data.currency === V4_CURRENCY_USD
      ? ((rewardAmount ?? 0n) * 1000n) / 1005n
      : rewardAmount ?? 0n

  const modalTitle = React.useMemo(() => {
    const tokensTextLong = tokenSymbolText({
      tokenSymbol: token.data?.symbol,
      capitalize: false,
      plural: true,
      includeTokenWord: true,
    })
    if (canRedeem) {
      return t`Cash out ${tokensTextLong} for ETH`
    }
    return t`Burn ${tokensTextLong}`
  }, [canRedeem, token.data?.symbol])

  const validateRedeemAmount = () => {
    if (redeemAmountBigInt === 0n) {
      return Promise.reject(t`Required`)
    } else if (redeemAmountBigInt > userTokenBalance) {
      return Promise.reject(t`Insufficient token balance`)
    } else if (redeemAmountBigInt > totalTokenSupply) {
      // Error message already showing for this case
      return Promise.reject()
    }
    return Promise.resolve()
  }

  const executeRedeemTransaction = async () => {
    await form.validateFields()
    if (!minReturnedTokens) return
    if (!contracts.primaryNativeTerminal.data || !projectId) {
      emitErrorNotification('Failed to prepare transaction')
      return
    }
    if (!userAddress) {
      emitErrorNotification('No wallet connected')
      return
    }

    setLoading(true)

    try {
      const hash = await writeRedeem({
        address: contracts.primaryNativeTerminal.data,
        args: [
          userAddress,
          BigInt(projectId),
          redeemAmountBigInt,
          NATIVE_TOKEN,
          0n,
          userAddress,
          '0x0',
        ] as const,
      })
      addTransaction?.('Redeem', { hash })

      setTransactionPending(true)
      form.resetFields()

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })
      setTransactionPending(false)
      setLoading(false)
      onConfirmed?.()
    } catch (e) {
      setTransactionPending(false)
      setLoading(false)
      emitErrorNotification((e as unknown as Error).message)
    }
  }

  const executeBurnTransaction = async () => {
    await form.validateFields()
    if (!contracts.controller.data || !projectId) {
      emitErrorNotification('Failed to prepare transaction')
      return
    }
    if (!userAddress) {
      emitErrorNotification('No wallet connected')
      return
    }

    setLoading(true)

    try {
      const hash = await writeBurnTokens({
        address: contracts.controller.data,
        args: [userAddress, projectId, redeemAmountBigInt, memo] as const,
      })
      addTransaction?.('Burn', { hash })
      setTransactionPending(true)
      form.resetFields()

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })
      setTransactionPending(false)
      setLoading(false)
      onConfirmed?.()
    } catch (e) {
      setTransactionPending(false)
      setLoading(false)
      emitErrorNotification((e as unknown as Error).message)
    }
  }

  return (
    <TransactionModal
      transactionPending={transactionPending}
      title={modalTitle}
      open={open}
      confirmLoading={loading}
      onOk={() => {
        canRedeem ? executeRedeemTransaction() : executeBurnTransaction()
      }}
      onCancel={() => {
        form.resetFields()
        onCancel?.()
      }}
      okText={modalTitle}
      okButtonProps={{
        disabled:
          !redeemAmount || parseFloat(redeemAmount) === 0 || !checkedLegal,
      }}
      width={540}
      centered
    >
      <div className="flex flex-col gap-6">
        <div>
          {canRedeem ? (
            <div className="flex flex-col gap-4">
              <Callout.Info>
                <Trans>Tokens are burned when they are redeemed.</Trans>
              </Callout.Info>
              <div>
                <Trans>
                  Cash out your tokens to reclaim some ETH that isn't needed for
                  payouts. This cycle's <strong>redemption rate</strong>{' '}
                  determines the amount of ETH you'll receive.
                </Trans>
              </div>
            </div>
          ) : (
            <Callout.Info>
              {!hasSurplus && (
                <Trans>
                  <strong>
                    This project has no ETH available for redemptions
                  </strong>
                  . You won't receive any ETH for burning your tokens.
                </Trans>
              )}
              {!redemptionEnabled && (
                <Trans>
                  <strong>This project has a redemptions turned off</strong>.
                  You won't receive any ETH for burning your tokens.
                </Trans>
              )}
            </Callout.Info>
          )}
        </div>

        <Descriptions
          column={1}
          contentStyle={{ display: 'block', textAlign: 'right' }}
        >
          <Descriptions.Item label={<Trans>Redemption rate</Trans>}>
            {rulesetMetadata?.cashOutTaxRate.formatPercentage()}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Trans>
                Your{' '}
                {tokenSymbolText({
                  tokenSymbol: token.data?.symbol,
                })}{' '}
                balance
              </Trans>
            }
          >
            <TokenAmount
              amountWad={BigNumber.from(userTokenBalance) ?? BigNumber.from(0)}
              tokenSymbol={token.data?.symbol}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Total redemption value</Trans>}>
            <ETHAmount amount={BigNumber.from(maxClaimable)} />
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            <Form.Item
              name="redeemAmount"
              label={
                canRedeem ? (
                  <Trans>Tokens to cash out</Trans>
                ) : (
                  <Trans>Tokens to burn</Trans>
                )
              }
              rules={[{ validator: validateRedeemAmount }]}
            >
              <FormattedNumberInput
                min={0}
                step={0.001}
                placeholder="0"
                // value={redeemAmount}
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() => {
                      form.setFieldsValue({
                        redeemAmount: formatEther(userTokenBalance),
                      })
                    }}
                  />
                }
                disabled={userTokenBalance === 0n}
                // onChange={val => form.se(val)}
              />
            </Form.Item>
            <Form.Item
              className="mb-0"
              name="legalCheckbox"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(t`You must confirm your compliance.`),
                        ),
                },
              ]}
            >
              <Checkbox>
                <span className="font-normal">
                  <Trans>
                    I confirm that the use and redemption of crypto tokens is
                    legal in my jurisdiction, and that I am fully responsible
                    for compliance with all relevant laws and regulations.
                  </Trans>
                </span>
              </Checkbox>
            </Form.Item>

            {/* Will comment memo form due to [note] missing in subgraph - see discussion in https://discord.com/channels/939317843059679252/1035458515709464586/1053400936971771974 */}
            {/* <Form.Item label={t`Memo`}>
              <MemoFormInput value={memo} onChange={setMemo} />
            </Form.Item> */}
          </Form>

          {canRedeem && !totalSupplyExceeded && minReturnedTokens > 0n ? (
            <div className="mt-5 font-medium">
              <>
                {/* If USD denominated, can only define the lower limit (not exact amount), hence 'at least' */}
                {/* Using 4 full sentences for translation purposes */}
                {!personalBalanceExceeded ? (
                  <>
                    {inUsd ? (
                      <Trans>
                        You will receive at least{' '}
                        <ETHAmount amount={BigNumber.from(minReturnedTokens)} />
                      </Trans>
                    ) : (
                      <Trans>
                        You will receive{' '}
                        <ETHAmount amount={BigNumber.from(minReturnedTokens)} />
                      </Trans>
                    )}
                  </>
                ) : (
                  <>
                    {inUsd ? (
                      <Trans>
                        You would receive at least{' '}
                        <ETHAmount amount={BigNumber.from(minReturnedTokens)} />
                      </Trans>
                    ) : (
                      <Trans>
                        You would receive{' '}
                        <ETHAmount amount={BigNumber.from(minReturnedTokens)} />
                      </Trans>
                    )}
                  </>
                )}
              </>
            </div>
          ) : null}
        </div>
      </div>
    </TransactionModal>
  )
}
