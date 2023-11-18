import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { RedeemAMMPrices } from 'components/Project/RedeemAMMPrices'
import { TokenAmount } from 'components/TokenAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useETHReceivedFromTokens } from 'hooks/v2v3/contractReader/useETHReceivedFromTokens'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useBurnTokensTx } from 'hooks/v2v3/transactor/useBurnTokensTx'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/useRedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { formatRedemptionRate } from 'utils/v2v3/math'

// This doubles as the 'Redeem' and 'Burn' modal depending on if project has overflow
export function V2V3BurnOrRedeemModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    tokenSymbol,
    tokenAddress,
    fundingCycle,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    distributionLimitCurrency,
    fundingCycleMetadata,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [memo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{
    redeemAmount: string
    legalCheckbox: boolean
  }>()

  const checkedLegal = useWatch('legalCheckbox', form)
  const { userAddress } = useWallet()
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const maxClaimable = useETHReceivedFromTokens({
    tokenAmount: fromWad(totalBalance),
  })
  const rewardAmount = useETHReceivedFromTokens({ tokenAmount: redeemAmount })
  const redeemTokensTx = useRedeemTokensTx()
  const burnTokensTx = useBurnTokensTx()

  if (!fundingCycle || !fundingCycleMetadata) return null

  // 0.5% slippage for USD-denominated projects
  const minReturnedTokens = distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : // ? rewardAmount?.mul(100).div(101)
      rewardAmount

  const tokensTextLong = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })

  let modalTitle: string

  const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  const hasRedemptionRate = fundingCycleMetadata.redemptionRate.gt(0)

  // Single source of truth for determining if a user can redeem.
  // If this is false, the user is burning their tokens.
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

  const executeRedeemTransaction = async () => {
    await form.validateFields()
    if (!minReturnedTokens) return

    setLoading(true)

    const txSuccess = await redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minReturnedTokens,
        memo,
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
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const executeBurnTransaction = async () => {
    await form.validateFields()

    setLoading(true)

    const txSuccess = await burnTokensTx(
      {
        burnAmount: parseWad(redeemAmount),
        memo,
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
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
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
  const inUSD = distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)

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
        setRedeemAmount(undefined)

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
                  Redeem your tokens to reclaim some ETH that isn't needed for
                  payouts. This cycle's <strong>redemption rate</strong>{' '}
                  determines the amount of ETH you'll receive.
                </Trans>
              </div>
            </div>
          ) : (
            <Callout.Info>
              {!hasOverflow && (
                <Trans>
                  <strong>
                    This project has no ETH available for redemptions
                  </strong>
                  . You won't receive any ETH for burning your tokens.
                </Trans>
              )}
              {!hasRedemptionRate && (
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
            <TokenAmount
              amountWad={totalBalance ?? BigNumber.from(0)}
              tokenSymbol={tokenSymbol}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Total redemption value</Trans>}>
            <ETHAmount amount={maxClaimable} />
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            <Form.Item
              name="redeemAmount"
              label={
                canRedeem ? (
                  <Trans>Tokens to redeem</Trans>
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
                value={redeemAmount}
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                }
                disabled={totalBalance?.eq(0)}
                onChange={val => setRedeemAmount(val)}
              />
              {tokenSymbol && tokenAddress ? (
                <RedeemAMMPrices
                  className="text-xs"
                  tokenSymbol={tokenSymbol}
                  tokenAddress={tokenAddress}
                />
              ) : null}
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

          {canRedeem && !totalSupplyExceeded && minReturnedTokens?.gt(0) ? (
            <div className="mt-5 font-medium">
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
      </div>
    </TransactionModal>
  )
}
