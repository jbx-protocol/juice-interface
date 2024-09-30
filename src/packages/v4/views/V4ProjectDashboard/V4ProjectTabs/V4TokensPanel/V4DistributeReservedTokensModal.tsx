import { t, Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import TransactionModal from 'components/modals/TransactionModal'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { useJBContractContext, useReadJbTokensTokenOf, useWriteJbControllerSendReservedTokensToSplitsOf } from 'juice-sdk-react'
import SplitList from 'packages/v4/components/SplitList/SplitList'
import useProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useV4ReservedTokensSubPanel } from './hooks/useV4ReservedTokensSubPanel'

export default function V4DistributeReservedTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { addTransaction } = useContext(TxHistoryContext)

  const { projectId, contracts } = useJBContractContext()
  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: projectOwnerAddress } = useProjectOwnerOf()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  // const distributeReservedTokensTx = useDistributeReservedTokens()
  const { writeContractAsync: writeSendReservedTokens, data } =
    useWriteJbControllerSendReservedTokensToSplitsOf()

  const { pendingReservedTokens, pendingReservedTokensFormatted } =
    useV4ReservedTokensSubPanel()

  async function sendReservedTokens() {
    if (
      // !payoutLimitAmountCurrency ||
      // !distributionAmount ||
      !contracts.controller.data ||
      !projectId
    )
      return

    setLoading(true)

    const args = [
      BigInt(projectId)
    ] as const

    try {
      const hash = await writeSendReservedTokens({
        address: contracts.controller.data,
        args,
      })
      setTransactionPending(true)

      addTransaction?.('Send reserved tokens', { hash })
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

  const tokenTextPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const tokenTextSingular = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <TransactionModal
      title={<Trans>Send reserved {tokenTextPlural}</Trans>}
      open={open}
      onOk={() => sendReservedTokens()}
      okText={t`Send ${tokenTextPlural}`}
      connectWalletText={t`Connect wallet to send reserved ${tokenTextPlural}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      width={640}
      centered={true}
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <Trans>
            Reserved {tokenTextPlural}:{' '}
            <span>
              {pendingReservedTokensFormatted} {tokenTextPlural}
            </span>
          </Trans>
        </div>
        <div>
          <h4>
            <Trans>{tokenTextSingular} recipients</Trans>
          </h4>

          {reservedTokensSplits?.length === 0 ? (
            <p>
              <Trans>
                The project owner is the only reserved token recipient. Any
                reserved tokens sent out this cycle will go to them.
              </Trans>
            </p>
          ) : null}

          <SplitList
            splits={reservedTokensSplits ?? []}
            projectOwnerAddress={projectOwnerAddress}
            totalValue={pendingReservedTokens}
            valueSuffix={tokenTextPlural}
            showAmounts
            dontApplyFeeToAmounts
            valueFormatProps={{ precision: 0 }}
          />
        </div>
      </div>
    </TransactionModal>
  )
}
