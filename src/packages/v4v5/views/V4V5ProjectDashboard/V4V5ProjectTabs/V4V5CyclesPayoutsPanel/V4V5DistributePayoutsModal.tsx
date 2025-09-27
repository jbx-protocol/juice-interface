import { Trans, t } from '@lingui/macro'
import { NATIVE_TOKEN, NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import {
  JBChainId,
  useJBProjectId,
  useSuckers,
} from 'juice-sdk-react'
import { jbDirectoryAbi, jbMultiTerminalAbi, JBCoreContracts, jbContractAddress } from 'juice-sdk-core'
import { useReadContract, useWriteContract } from 'wagmi'
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
import { useWallet } from 'hooks/Wallet'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { PayoutsTable } from 'packages/v4v5/components/PayoutsTable/PayoutsTable'
import { usePayoutLimit } from 'packages/v4v5/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4v5/hooks/useV4V5CurrentPayoutSplits'
import { V4V5CurrencyName } from 'packages/v4v5/utils/currency'
import { wagmiConfig } from 'contexts/Para/Providers'
import { emitErrorNotification } from 'utils/notifications'
import { parseUnits } from 'viem'
import { useCyclesPanelSelectedChain } from './contexts/CyclesPanelSelectedChainContext'
import { useV4V5DistributableAmount } from './hooks/useV4V5DistributableAmount'

export default function V4V5DistributePayoutsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { data: payoutLimit } = usePayoutLimit()
  const { addTransaction } = useContext(TxHistoryContext)
  const { selectedChainId: defaultChainId } = useCyclesPanelSelectedChain()

  const [selectedChainId, setSelectedChainId] = useState<JBChainId | undefined>(
    defaultChainId,
  )

  const { data: suckers } = useSuckers()
  const selectedChainProjectId = suckers?.find(
    sucker => sucker.peerChainId === selectedChainId,
  )?.projectId

  const { distributableAmount: distributable, currency: distributableCurrency } = useV4V5DistributableAmount({
    chainId: selectedChainId,
    projectId: selectedChainProjectId,
  })

  const { data: payoutSplits } = useV4CurrentPayoutSplits(selectedChainId)

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<
    string | undefined
  >(distributable.format())

  const { projectId } = useJBProjectId(selectedChainId)
  const { writeContractAsync: writeSendPayouts } = useWriteContract()

  const { data: terminalAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: jbContractAddress['4'][JBCoreContracts.JBDirectory][selectedChainId ?? 1],
    functionName: 'primaryTerminalOf',
    args: [BigInt(projectId ?? 0), NATIVE_TOKEN],
    chainId: selectedChainId,
  })

  const { chain: walletChain, changeNetworks, connect } = useWallet()
  const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
  
  const walletConnectedToWrongChain = selectedChainId !== walletChainId

  async function executeDistributePayoutsTx() {
    if (
      !distributableCurrency ||
      !distributionAmount ||
      !selectedChainId ||
      !terminalAddress ||
      !projectId
    )
      return

    // Check if wallet is connected to wrong chain
    if (walletConnectedToWrongChain) {
      try {
        await changeNetworks(selectedChainId as JBChainId)
        return
      } catch (e) {
        emitErrorNotification((e as unknown as Error).message)
        return
      }
    }
    
    if (!walletChain) {
      await connect()
      return
    }

    setLoading(true)

    const args = [
      BigInt(projectId),
      NATIVE_TOKEN,
      parseUnits(distributionAmount, NATIVE_TOKEN_DECIMALS),
      BigInt(distributableCurrency),
      0n, // minTokensPaidOut
    ] as const

    try {
      const hash = await writeSendPayouts({
        address: terminalAddress,
        abi: jbMultiTerminalAbi,
        functionName: 'sendPayoutsOf',
        chainId: selectedChainId,
        args,
      })
      setTransactionPending(true)

      addTransaction?.(`Send payouts on ${NETWORKS[selectedChainId]?.label}`, {
        hash,
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: selectedChainId,
      })

      setLoading(false)
      setTransactionPending(false)
      onConfirmed?.()
    } catch (e) {
      setLoading(false)

      emitErrorNotification((e as unknown as Error).message)
    }
  }

  const currencyName = V4V5CurrencyName(distributableCurrency)

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
      okText={
        walletConnectedToWrongChain
          ? t`Change networks to send payouts`
          : t`Send payouts`
      }
      connectWalletText={t`Connect wallet to send payouts`}
      width={640}
      className="top-[40px]"
    >
      <div className="flex flex-col gap-6">
        <Form layout="vertical">
          {suckers && suckers.length > 1 ? (
            <Form.Item className="mb-4" label={<Trans>Chain</Trans>}>
              <ChainSelect
                value={selectedChainId}
                onChange={setSelectedChainId}
                chainIds={suckers.map(s => s.peerChainId)}
                showTitle
              />
            </Form.Item>
          ) : null}
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