import { Trans, t } from '@lingui/macro'
import { Button, Empty } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import ETHAmount from 'components/currency/ETHAmount'
import TransactionModal from 'components/modals/TransactionModal'
import { JBChainId } from 'juice-sdk-core'
import type { RelayrPostBundleResponse } from 'juice-sdk-react'
import { useSuckers } from 'juice-sdk-react'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { useHasNftRewards } from 'packages/v4/hooks/useHasNftRewards'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { emitErrorNotification } from 'utils/notifications'
import { TransactionSuccessModal } from '../../EditCyclePage/TransactionSuccessModal'
import { useEditingNfts } from '../hooks/useEditingNfts'
import { useOmnichainUpdateCurrentCollection } from '../hooks/useOmnichainUpdateCurrentCollection'
import { useUpdateCurrentCollection } from '../hooks/useUpdateCurrentCollection'

export function EditNftsSection() {
  const nftRewardsData = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const { rewardTiers, setRewardTiers, editedRewardTierIds, loading } =
    useEditingNfts()
  const hasNftRewards = useHasNftRewards()
  const { updateExistingCollection, txLoading } = useUpdateCurrentCollection({
    rewardTiers: rewardTiers!,
    editedRewardTierIds,
    onConfirmed: () => setSuccessModalOpen(true),
  })

  const { getUpdateQuote, sendRelayrTx, relayrBundle } = useOmnichainUpdateCurrentCollection()
  const [selectedRelayrChains, setSelectedRelayrChains] = useState<Partial<Record<JBChainId, boolean>>>(() => ({}))
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId>()
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)
  const [txSigning, setTxSigning] = useState(false)

  const { data: suckers } = useSuckers()
  const chainIds = useMemo(() => suckers?.map(s => s.peerChainId as JBChainId) ?? [], [suckers])
  useEffect(() => { 
    if (chainIds.length && !selectedGasChain) setSelectedGasChain(chainIds[0]) 
  }, [chainIds, selectedGasChain])

  const activeChains = Object.entries(selectedRelayrChains).filter(([_,v]) => v).map(([k]) => Number(k) as JBChainId)

  const showNftRewards = hasNftRewards

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)
    await updateExistingCollection()
    setSubmitLoading(false)
  }, [rewardTiers, updateExistingCollection])

  // Replace updateExistingCollection for omnichain
  const onEditSave = async () => {
    if (activeChains.length <= 1) {
      // single chain: use existing
      setSubmitLoading(true)
      await updateExistingCollection()
      setSubmitLoading(false)
      return
    }
    if (!txQuote) {
      setTxQuoteLoading(true)
      try {
        const quote = await getUpdateQuote(rewardTiers!, editedRewardTierIds, activeChains)
        setTxQuote(quote!)      
      } catch (e) {
        emitErrorNotification((e as Error).message)
      } finally {
        setTxQuoteLoading(false)
      }
      return
    }
    // send tx
    setTxSigning(true)
    const payment = txQuote.payment_info.find(p => Number(p.chain) === selectedGasChain)
    if (!payment) { setTxSigning(false); return }
    await sendRelayrTx(payment)
    relayrBundle.startPolling(txQuote.bundle_uuid)
    setTxSigning(false)
  }

  // poll bundle
  useEffect(() => {
    if (relayrBundle.isComplete) {
      setSuccessModalOpen(true)
    }
  }, [relayrBundle.isComplete])

  if (loading) return <Loading className="mt-20" />

  const allNftsRemoved = showNftRewards && rewardTiers?.length === 0

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

      {/* chain toggles */}
      {chainIds.length > 1 && (
        <div className="mb-4 flex gap-2">
          {chainIds.map(c => (
            <Button key={c} type={selectedRelayrChains[c] ? 'primary':'default'} onClick={() => setSelectedRelayrChains(prev => ({ ...prev, [c]: !prev[c] }))}>
              {c}
            </Button>
          ))}
        </div>
      )}
      {/* gas quote & pay chain */}
      {txQuote && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span><Trans>Gas quote</Trans>:</span>
            <ETHAmount amount={BigNumber.from(txQuote.payment_info.find(p => Number(p.chain) === selectedGasChain)?.amount ?? '0')} />
          </div>
          <div className="mt-2">
            <Trans>Pay gas on</Trans>
            <ChainSelect value={selectedGasChain} onChange={setSelectedGasChain} chainIds={activeChains} />
          </div>
        </div>
      )}
      {/* override button */}
      <Button onClick={onEditSave} htmlType="submit" type="primary" loading={txQuoteLoading || txSigning || submitLoading}>
        <span><Trans>Edit NFTs</Trans></span>
      </Button>

      <TransactionModal transactionPending open={txLoading} />
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
    </>
  )
}
