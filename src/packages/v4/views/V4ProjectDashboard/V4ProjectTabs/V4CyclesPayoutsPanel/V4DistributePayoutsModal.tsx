import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { FEES_EXPLANATION } from 'components/strings'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useUsedPayoutLimitOf } from 'packages/v4/hooks/useUsedPayoutLimitOf'
import { useV4BalanceOfNativeTerminal } from 'packages/v4/hooks/useV4BalanceOfNativeTerminal'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import { useEffect, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { useV4CurrentPayoutSplits } from '../../../../hooks/useV4PayoutSplits'

export default function V4DistributePayoutsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { splits: payoutSplits } = useV4CurrentPayoutSplits()
  const { data: usedPayoutLimit } = useUsedPayoutLimitOf()
  const { data: payoutLimit } = usePayoutLimit()
  const { data: balanceOfNativeTerminal } = useV4BalanceOfNativeTerminal()

  const payoutLimitAmount = payoutLimit?.amount
  const payoutLimitAmountCurrency = payoutLimit?.currency

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<string>()

  // TODO: const v4DistributePayoutsTx = useV4DistributePayoutsTx()

  useEffect(() => {
    if (!payoutLimitAmount) return

    const unusedFunds = payoutLimitAmount - (usedPayoutLimit ?? 0n) ?? 0n
    const distributable = balanceOfNativeTerminal && balanceOfNativeTerminal > unusedFunds
      ? unusedFunds
      : 0n

    setDistributionAmount(fromWad(distributable))
  }, [
    balanceOfNativeTerminal,
    payoutLimitAmount,
    usedPayoutLimit,
  ])

  async function executeDistributePayoutsTx() {
    if (!payoutLimitAmountCurrency || !distributionAmount) return

    setLoading(true)

    const txSuccessful = true
    // TODO: const txSuccessful = await v4DistributePayoutsTx(
    //   {
    //     amount: distributionAmount,
    //     currency: payoutLimitAmountCurrency,
    //   },
    //   {
    //     onDone: () => {
    //       setTransactionPending(true)
    //     },
    //     onConfirmed: () => {
    //       setLoading(false)
    //       setTransactionPending(false)
    //       onConfirmed?.()
    //     },
    //   },
    // )

    if (!txSuccessful) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  const unusedFunds = payoutLimitAmount ?
    payoutLimitAmount - (usedPayoutLimit ?? 0n) : 0n

  const distributable = balanceOfNativeTerminal && balanceOfNativeTerminal > unusedFunds
    ? unusedFunds
    : 0n

  const currencyName = V4CurrencyName(payoutLimitAmountCurrency)

  return (
    <TransactionModal
      title={<Trans>Send payouts</Trans>}
      open={open}
      onOk={executeDistributePayoutsTx}
      onCancel={() => {
        setDistributionAmount(undefined)
        onCancel?.()
      }}
      okButtonProps={{
        disabled: !distributionAmount || distributionAmount === '0',
      }}
      confirmLoading={loading}
      transactionPending={transactionPending}
      okText={t`Send payouts`}
      connectWalletText={t`Connect wallet to send payouts`}
      width={640}
      className="top-[40px]"
    >
      <div className="flex flex-col gap-6">
        <Form layout="vertical">
          <Form.Item
            className="mb-0"
            label={<Trans>Amount to pay out</Trans>}
            extra={<Trans>Recipients will recieve payouts in ETH</Trans>}
          >
            <FormattedNumberInput
              placeholder="0"
              value={distributionAmount}
              onChange={value => setDistributionAmount(value)}
              min={0}
              accessory={
                <div className="flex items-center">
                  <span className="mr-2 text-black dark:text-slate-100">
                    {currencyName}
                  </span>
                  <InputAccessoryButton
                    content={<Trans>MAX</Trans>}
                    onClick={() =>
                      setDistributionAmount(fromWad(distributable))
                    }
                  />
                </div>
              }
            />
          </Form.Item>
        </Form>
        <div>
          <div className="text-md mb-2 font-medium">
            <Trans>Payout recipients</Trans>
          </div>

          {payoutSplits?.length === 0 ? (
            <Callout.Info className="mb-4">
              <Trans>
                The project owner is the only payout recipient. Any ETH paid out
                this cycle will go to them.
              </Trans>
            </Callout.Info>
          ) : null}

          <div className="max-h-[33vh] overflow-y-auto">
            {/* <PayoutsTable
              payoutSplits={payoutSplits ?? []}
              currency={currencyName}
              payoutLimitAmount={parseFloat(distributionAmount ?? '0')} // payoutLimitAmount is the amount to distribute in the instance.
              hideHeader
              showAvatars
            /> */}
          </div>
        </div>

        <Callout.Info>{FEES_EXPLANATION}</Callout.Info>
      </div>
    </TransactionModal>
  )
}
