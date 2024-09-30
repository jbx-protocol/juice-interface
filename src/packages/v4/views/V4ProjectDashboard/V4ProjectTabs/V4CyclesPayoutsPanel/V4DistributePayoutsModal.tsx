import { t, Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { FEES_EXPLANATION } from 'components/strings'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { NATIVE_TOKEN, NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import {
  useJBContractContext,
  useWriteJbMultiTerminalSendPayoutsOf,
} from 'juice-sdk-react'
import { PayoutsTable } from 'packages/v4/components/PayoutsTable/PayoutsTable'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4PayoutSplits'
import { V4_CURRENCY_ETH, V4CurrencyName } from 'packages/v4/utils/currency'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { parseUnits } from 'viem'
import { useV4DistributableAmount } from './hooks/useV4DistributableAmount'

export default function V4DistributePayoutsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { data: payoutSplits } = useV4CurrentPayoutSplits()
  const { data: payoutLimit } = usePayoutLimit()
  const { distributableAmount: distributable } = useV4DistributableAmount()
  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const payoutLimitAmountCurrency = payoutLimit?.currency ?? V4_CURRENCY_ETH

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<string>()

  const { writeContractAsync: writeSendPayouts } =
    useWriteJbMultiTerminalSendPayoutsOf()

  async function executeDistributePayoutsTx() {
    if (
      !payoutLimitAmountCurrency ||
      !distributionAmount ||
      !contracts.primaryNativeTerminal.data ||
      !projectId
    )
      return

    setLoading(true)

    const args = [
      BigInt(projectId),
      NATIVE_TOKEN,
      parseUnits(distributionAmount, NATIVE_TOKEN_DECIMALS),
      BigInt(payoutLimitAmountCurrency),
      0n, // TODO?
    ] as const

    try {
      const hash = await writeSendPayouts({
        address: contracts.primaryNativeTerminal.data,
        args,
      })
      setTransactionPending(true)

      addTransaction?.('Send payouts', { hash })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })

      setLoading(false)
      setTransactionPending(false)
      onConfirmed?.()
    } catch (e) {
      setLoading(false)

      emitErrorNotification((e as unknown as Error).message)
    }
  }

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
                      setDistributionAmount(distributable.format())
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

          <div className="max-h-[33vh] overflow-y-auto">
            <PayoutsTable
              payoutSplits={payoutSplits ?? []}
              currency={currencyName ?? 'ETH'}
              distributionLimit={parseFloat(distributionAmount ?? '0')} // payoutLimitAmount is the amount to distribute in the instance.
              hideHeader
              showAvatars
            />
          </div>
        </div>

        <Callout.Info>{FEES_EXPLANATION}</Callout.Info>
      </div>
    </TransactionModal>
  )
}
