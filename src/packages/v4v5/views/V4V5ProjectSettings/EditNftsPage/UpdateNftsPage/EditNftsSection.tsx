import { Trans, t } from '@lingui/macro'
import { Button, Empty } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import ETHAmount from 'components/currency/ETHAmount'
import TransactionModal from 'components/modals/TransactionModal'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { JBChainId } from 'juice-sdk-core'
import type { RelayrPostBundleResponse } from 'juice-sdk-react'
import { useSuckers } from 'juice-sdk-react'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { useHasNftRewards } from 'packages/v4v5/hooks/useHasNftRewards'
import useV4ProjectOwnerOf from 'packages/v4v5/hooks/useV4ProjectOwnerOf'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { emitErrorNotification } from 'utils/notifications'
import { TransactionSuccessModal } from '../../EditCyclePage/TransactionSuccessModal'
import { useEditingNfts } from '../hooks/useEditingNfts'
import { useOmnichainUpdateCurrentCollection } from '../hooks/useOmnichainUpdateCurrentCollection'
import { useUpdateCurrentCollection } from '../hooks/useUpdateCurrentCollection'
import QueueSafeEditNftsTxsModal from './components/QueueSafeEditNftsTxsModal'

export function EditNftsSection() {
  const nftRewardsData = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [safeModalOpen, setSafeModalOpen] = useState(false)

  const { rewardTiers, setRewardTiers, editedRewardTierIds, loading } =
    useEditingNfts()
  const hasNftRewards = useHasNftRewards()
  const { updateExistingCollection, txLoading } = useUpdateCurrentCollection({
    rewardTiers: rewardTiers!,
    editedRewardTierIds,
    onConfirmed: () => setSuccessModalOpen(true),
  })

  const { getUpdateQuote, sendRelayrTx, relayrBundle } = useOmnichainUpdateCurrentCollection()
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId>()
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)

  const { data: suckers } = useSuckers()
  const chainIds = useMemo(() => suckers?.map(s => s.peerChainId as JBChainId) ?? [], [suckers])
  useEffect(() => { 
    if (chainIds.length && !selectedGasChain) setSelectedGasChain(chainIds[0]) 
  }, [chainIds, selectedGasChain])

  // Project owner and Gnosis Safe detection
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  const { data: gnosisSafeData } = useGnosisSafe(projectOwnerAddress)
  const isProjectOwnerGnosisSafe = Boolean(gnosisSafeData)
  const isOmnichainProject = chainIds.length > 1

  // always use all project chains
  const activeChains = chainIds

  const showNftRewards = hasNftRewards

  // omnichain modal handlers
  const handleGetQuote = async () => {
    setTxQuoteLoading(true)
    try {
      const quote = await getUpdateQuote(rewardTiers!, editedRewardTierIds, activeChains)
      setTxQuote(quote!)      
    } catch (e) {
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }
  const handleConfirm = async () => {
    if (!isOmnichainProject) {
      // Use single-chain transaction for non-omnichain projects
      return handleSingleChainUpdate()
    }
    
    if (!txQuote) return handleGetQuote()
    setConfirmLoading(true)
    try {
      const payment = txQuote.payment_info.find(p => Number(p.chain) === selectedGasChain)
      if (!payment) throw new Error('No payment info for selected chain')

      await sendRelayrTx(payment)
      relayrBundle.startPolling(txQuote.bundle_uuid)
    } catch (e) {
      emitErrorNotification((e as Error).message)
    }
  }

  // handle single-chain update using original updateExistingCollection
  const handleSingleChainUpdate = async () => {
    setConfirmLoading(true)
    try {
      await updateExistingCollection()
      setConfirmLoading(false)
      setModalOpen(false)
      setSuccessModalOpen(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      emitErrorNotification(`Failed to update NFTs: ${errorMessage}`)
      setConfirmLoading(false)
    }
  }
  useEffect(() => {
    if (relayrBundle.isComplete) {
      setModalOpen(false)
      setSuccessModalOpen(true)
    }
  }, [relayrBundle.isComplete])

  if (loading) return <Loading className="mt-20" />

  const allNftsRemoved = showNftRewards && rewardTiers?.length === 0
  
  const txSigning = Boolean(relayrBundle.uuid) && !relayrBundle.isComplete
  
  return (
    <>
      <Callout.Info className="text-primary mb-5 bg-smoke-100 dark:bg-slate-500">
        <Trans>Changes to NFTs will take effect immediately.</Trans>
      </Callout.Info>

      <div className="mb-8">
        <RewardsList
          priceCurrencySymbol={'ETH'}
          nftRewardsData={nftRewardsData}
          value={rewardTiers}
          onChange={setRewardTiers}
          allowCreate
          withEditWarning
        />

        {rewardTiers?.length === 0 && (
          <Empty
            className="mb-0"
            description={t`No NFTs`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      {allNftsRemoved && (
        <Callout.Warning className="mb-5 bg-smoke-100 dark:bg-slate-500">
          <Trans>
            <p>
              You're about to delete all NFTs from your collection. This will
              take effect immediately, and you can add NFTs back to the
              collection at any time.
            </p>
            <p>
              If you want to COMPLETELY detach NFTs from your project, you can
              do so in the <strong>Danger Zone</strong> section below.
            </p>
          </Trans>
        </Callout.Warning>
      )}

      {/* trigger modal - check if Safe + omnichain */}
      <Button 
        type="primary" 
        onClick={() => {
          // Check if project owner is Gnosis Safe and project is omnichain
          if (isProjectOwnerGnosisSafe && isOmnichainProject) {
            setSafeModalOpen(true)
          } else {
            setModalOpen(true)
          }
        }} 
        loading={submitLoading || txQuoteLoading || txSigning}
      >
        <span><Trans>Edit NFTs</Trans></span>
      </Button>

      {/* review & confirm modal */}
      <TransactionModal
        open={modalOpen}
        title={<Trans>Edit NFTs</Trans>}
        onOk={handleConfirm}
        okText={
          !isOmnichainProject ? (
            <Trans>Edit NFTs</Trans>
          ) : !txQuote ? (
            <Trans>Get edit quote</Trans>
          ) : (
            <Trans>Edit NFTs</Trans>
          )
        }
        confirmLoading={confirmLoading || txQuoteLoading || txSigning}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setModalOpen(false)}
        transactionPending={txSigning}
        chainIds={isOmnichainProject ? activeChains : undefined}
        relayrResponse={relayrBundle.response}
      >
        {!isOmnichainProject ? (
          <div className="py-4 text-sm">
            <Callout.Info>
              <Trans>
                You'll be prompted a wallet signature to submit the transaction.
              </Trans>
            </Callout.Info>
          </div>
        ) : !txQuote ? (
          <Callout.Info>
            <Trans>
              You'll be prompted a wallet signature for each of this project's chains before final submission.
            </Trans>
          </Callout.Info>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span><Trans>Gas quote:</Trans></span>
              <ETHAmount amount={BigNumber.from(txQuote.payment_info.find(p => Number(p.chain) === selectedGasChain)?.amount || '0')} />
            </div>
            <div className="flex justify-between">
              <span><Trans>Pay gas on:</Trans></span>
              <ChainSelect value={selectedGasChain} onChange={setSelectedGasChain} chainIds={chainIds} showTitle />
            </div>
          </>
        )}
      </TransactionModal>

      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your NFTs have been edited successfully</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will available on your project page shortly.
              </Trans>
            </div>
          </>
        }
      />

      <QueueSafeEditNftsTxsModal
        open={safeModalOpen}
        onCancel={() => setSafeModalOpen(false)}
        rewardTiers={rewardTiers || []}
        editedRewardTierIds={editedRewardTierIds}
        onSuccess={() => setSuccessModalOpen(true)}
      />
    </>
  )
}
