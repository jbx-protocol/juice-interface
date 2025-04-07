import { Trans, t } from '@lingui/macro'
import { useJBContractContext, useJBTokenContext, useWriteJbControllerSendReservedTokensToSplitsOf } from 'juice-sdk-react'
import { useContext, useState } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import TransactionModal from 'components/modals/TransactionModal'
import { NETWORKS } from 'constants/networks'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { JBChainId } from 'juice-sdk-core'
import SplitList from 'packages/v4/components/SplitList/SplitList'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useV4ReservedTokensSubPanel } from './hooks/useV4ReservedTokensSubPanel'

export default function V4DistributeReservedTokensModal({
  open,
  onCancel,
  onConfirmed,
  chainId
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
  chainId: JBChainId
}) {
  const { addTransaction } = useContext(TxHistoryContext)

  const { projectId, contracts } = useJBContractContext()
  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()

  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const { writeContractAsync: writeSendReservedTokens, data } =
    useWriteJbControllerSendReservedTokensToSplitsOf()

  const { pendingReservedTokens, pendingReservedTokensFormatted } =
    useV4ReservedTokensSubPanel()
    
  const { chain: walletChain, changeNetworks, connect } = useWallet()
  const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
  const walletConnectedToWrongChain = chainId !== walletChainId

  async function sendReservedTokens() {
    if (
      // !payoutLimitAmountCurrency ||
      // !distributionAmount ||
      !contracts.controller.data ||
      !projectId
    ) {
      return
    }

    // Check if wallet is connected to wrong chain
    if (walletConnectedToWrongChain) {
      try {
        await changeNetworks(chainId)
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

    const args = [BigInt(projectId)] as const

    try {
      const hash = await writeSendReservedTokens({
        address: contracts.controller.data,
        args,
        chainId
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

  if (!chainId) return null

  return (
    <TransactionModal
      title={<Trans>Send reserved {tokenTextPlural} on {NETWORKS[chainId].label}</Trans>}
      open={open}
      onOk={() => sendReservedTokens()}
      okText={
        walletConnectedToWrongChain
          ? t`Change networks to send reserved ${tokenTextPlural}`
          : t`Send ${tokenTextPlural}`
      }
      connectWalletText={t`Connect wallet to send reserved ${tokenTextPlural}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      width={640}
      centered
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
