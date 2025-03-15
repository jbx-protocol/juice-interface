import { Trans, t } from '@lingui/macro'
import { NATIVE_TOKEN, NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import {
  JBChainId,
  useJBContractContext,
  useReadJbDirectoryPrimaryTerminalOf,
  useSuckers,
  useWriteJbMultiTerminalSendPayoutsOf,
} from 'juice-sdk-react'
import { V4CurrencyName, V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { useContext, useState } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { FEES_EXPLANATION } from 'components/strings'
import { NETWORKS } from 'constants/networks'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { PayoutsTable } from 'packages/v4/components/PayoutsTable/PayoutsTable'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4CurrentPayoutSplits'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
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
  const { projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const { data: suckers } = useSuckers()

  const payoutLimitAmountCurrency = payoutLimit?.currency ?? V4_CURRENCY_ETH

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<string>()
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>()

  const { writeContractAsync: writeSendPayouts } =
    useWriteJbMultiTerminalSendPayoutsOf()
  
  const { data: terminalAddress } = useReadJbDirectoryPrimaryTerminalOf({
    chainId: selectedChainId,
    args: [projectId, NATIVE_TOKEN],
  })

  const selectedChainProjectId = suckers?.find((sucker) => sucker.peerChainId === selectedChainId)?.projectId

  const { distributableAmount: distributable } = useV4DistributableAmount({
    chainId: selectedChainId,
    projectId: selectedChainProjectId
  })
  
  async function executeDistributePayoutsTx() {
    if (
      !payoutLimitAmountCurrency ||
      !distributionAmount ||
      !selectedChainId ||
      !terminalAddress ||
      !projectId
    )
      return

    setLoading(true)

    const args = [
      BigInt(projectId),
      NATIVE_TOKEN,
      parseUnits(distributionAmount, NATIVE_TOKEN_DECIMALS),
      BigInt(payoutLimitAmountCurrency),
      0n, // minTokensPaidOut
    ] as const

    try {
      const hash = await writeSendPayouts({
        address: terminalAddress, // TODOv4 Q: or should this just be contracts.primaryNativeTerminal.address?
        chainId: selectedChainId,
        args,
      })
      setTransactionPending(true)

      addTransaction?.(`Send payouts on ${NETWORKS[selectedChainId]?.label}`, { hash })
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
          {suckers && suckers.length > 1 ?
            <Form.Item
              className="mb-0"
              label={<Trans>Chain</Trans>}
            >
              <ChainSelect
                value={selectedChainId}
                onChange={setSelectedChainId}
                suckers={suckers}
                showSelectedName
              />
            </Form.Item>
          : null }
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
