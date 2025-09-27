import { JBChainId, formatEther } from 'juice-sdk-core'
import { Trans, t } from '@lingui/macro'
import { useContext, useEffect, useState } from 'react'
import { useJBProjectId, useJBTokenContext, useSuckers } from 'juice-sdk-react'
import { jbControllerAbi, jbDirectoryAbi, JBCoreContracts, jbContractAddress } from 'juice-sdk-core'
import { useReadContract, useWriteContract } from 'wagmi'

import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import SplitList from 'packages/v4v5/components/SplitList/SplitList'
import TransactionModal from 'components/modals/TransactionModal'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useMemo } from 'react'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4ReservedSplits } from 'packages/v4v5/hooks/useV4V5ReservedSplits'
import { useWallet } from 'hooks/Wallet'
import { wagmiConfig } from 'packages/v4v5/wagmiConfig'
import { waitForTransactionReceipt } from '@wagmi/core'

export default function V4V5DistributeReservedTokensModal({
  open,
  onCancel,
  onConfirmed,
  chainId: defaultChainId
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
  chainId: JBChainId
}) {
  const { addTransaction } = useContext(TxHistoryContext)
  
  // Chain selection state - separate from the hook's chain
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>(defaultChainId)
  const { data: suckers } = useSuckers()

  // Reset to default chain when modal opens
  useEffect(() => {
    if (open) {
      setSelectedChainId(defaultChainId)
    }
  }, [open, defaultChainId])

  // Get data for the selected chain in the modal
  const { projectId } = useJBProjectId(selectedChainId)
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf(selectedChainId)
  const { splits: reservedTokensSplits } = useV4ReservedSplits(selectedChainId)

  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const { writeContractAsync: writeSendReservedTokens } = useWriteContract()

  // Get controller and pending tokens for selected chain
  const projectIdBigInt = BigInt(projectId ?? 0)
  const { data: controllerAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: jbContractAddress['4'][JBCoreContracts.JBDirectory][selectedChainId],
    functionName: 'controllerOf',
    args: [projectIdBigInt],
    chainId: selectedChainId,
  })

  const { data: pendingReservedTokens } = useReadContract({
    abi: jbControllerAbi,
    address: controllerAddress,
    functionName: 'pendingReservedTokenBalanceOf',
    args: [projectIdBigInt],
    chainId: selectedChainId,
  })

  const pendingReservedTokensFormatted = useMemo(() => {
    if (pendingReservedTokens === undefined) return
    return formatEther(pendingReservedTokens, { fractionDigits: 6 })
  }, [pendingReservedTokens])
    
  const { chain: walletChain, changeNetworks, connect } = useWallet()
  const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
  const walletConnectedToWrongChain = selectedChainId !== walletChainId

  async function sendReservedTokens() {
    if (
      !controllerAddress ||
      !projectId
    ) {
      return
    }

    // Check if wallet is connected to wrong chain
    if (walletConnectedToWrongChain) {
      try {
        await changeNetworks(selectedChainId)
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
        address: controllerAddress,
        abi: jbControllerAbi,
        functionName: 'sendReservedTokensToSplitsOf',
        args,
        chainId: selectedChainId
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

  if (!selectedChainId) return null

  return (
    <TransactionModal
      title={<Trans>Send reserved {tokenTextPlural}</Trans>}
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
        {suckers && suckers.length > 1 && (
          <div className="flex items-center justify-between">
            <span className="font-medium">
              <Trans>Network</Trans>
            </span>
            <ChainSelect
              className="min-w-[175px]"
              value={selectedChainId}
              onChange={setSelectedChainId}
              chainIds={suckers.map(sucker => sucker.peerChainId)}
              showTitle
            />
          </div>
        )}
        
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
