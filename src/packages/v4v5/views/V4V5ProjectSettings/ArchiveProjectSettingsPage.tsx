import { Trans } from '@lingui/macro'
import { Button, Statistic } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { RelayrPostBundleResponse, useJBProjectMetadataContext, useSuckers } from 'juice-sdk-react'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useEditProjectDetailsTx } from 'packages/v4v5/hooks/useEditProjectDetailsTx'
import { useOmnichainEditProjectDetailsTx } from 'packages/v4v5/hooks/useOmnichainEditProjectDetailsTx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'
import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/currency/ETHAmount'
import TransactionModal from 'components/modals/TransactionModal'
import { JBChainId } from 'juice-sdk-core'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'

export function ArchiveProjectSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingArchived, setPendingArchived] = useState<boolean | null>(null)
  const [cid, setCid] = useState<`0x${string}` | null>(null)

  // Omnichain state
  const { data: suckers } = useSuckers()
  const projectChains = useMemo(() => suckers?.map(s => s.peerChainId) || [], [suckers])
  const isOmnichainProject = projectChains.length > 1
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId | undefined>(projectChains[0])
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const editV4ProjectDetailsTx = useEditProjectDetailsTx()
  const { getEditQuote, sendRelayrTx, relayrBundle } = useOmnichainEditProjectDetailsTx()
  const { metadata } = useJBProjectMetadataContext()

  const projectMetadata = metadata.data

  // Set default gas chain when suckers load
  useEffect(() => {
    if (projectChains.length > 0 && !selectedGasChain) {
      setSelectedGasChain(projectChains[0])
    }
  }, [projectChains, selectedGasChain])

  const handleGetQuote = async () => {
    if (!cid) return
    setTxQuoteLoading(true)
    try {
      const quote = await getEditQuote(cid)
      setTxQuote(quote)
    } catch (e) {
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }

  const handleSingleChainArchive = useCallback(async () => {
    if (!cid) return

    setConfirmLoading(true)
    try {
      await editV4ProjectDetailsTx(cid, {
        onTransactionPending: () => null,
        onTransactionConfirmed: () => {
          setConfirmLoading(false)
          setModalOpen(false)
          emitInfoNotification(
            pendingArchived ? 'Project archived' : 'Project unarchived',
            {
              description: pendingArchived
                ? 'Your project has been archived.'
                : 'Your project has been unarchived.',
            },
          )
        },
        onTransactionError: (error) => {
          console.error(error)
          setConfirmLoading(false)
          emitErrorNotification(`Error updating project: ${error.message}`)
        },
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to update project', error)
      emitErrorNotification(`Failed to update project: ${errorMessage}`)
      setConfirmLoading(false)
    }
  }, [cid, editV4ProjectDetailsTx, pendingArchived])

  const handleConfirm = async () => {
    if (!isOmnichainProject) {
      return handleSingleChainArchive()
    }

    if (!txQuote) return handleGetQuote()

    setConfirmLoading(true)
    try {
      const payment = txQuote.payment_info.find((p) => Number(p.chain) === selectedGasChain)
      if (!payment) throw new Error('No payment info for selected chain')
      await sendRelayrTx(payment)
      relayrBundle.startPolling(txQuote.bundle_uuid)
    } catch (e) {
      emitErrorNotification((e as Error).message)
      setConfirmLoading(false)
    }
  }

  // Poll for omnichain completion
  useEffect(() => {
    if (relayrBundle.isComplete) {
      setConfirmLoading(false)
      setModalOpen(false)
      emitInfoNotification(
        pendingArchived ? 'Project archived' : 'Project unarchived',
        {
          description: pendingArchived
            ? 'Your project has been archived across all chains.'
            : 'Your project has been unarchived across all chains.',
        },
      )
    } else if (relayrBundle.error) {
      emitErrorNotification(relayrBundle.error as string)
      setConfirmLoading(false)
    }
  }, [relayrBundle.isComplete, relayrBundle.error, pendingArchived])

  const setArchived = useCallback(async (archived: boolean) => {
    if (!projectMetadata) return

    setLoading(true)
    setPendingArchived(archived)

    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      archived,
    })

    if (!uploadedMetadata.Hash) {
      setLoading(false)
      return
    }

    const hash = uploadedMetadata.Hash as `0x${string}`
    setCid(hash)
    setLoading(false)
    setTxQuote(undefined)
    setModalOpen(true)
  }, [projectMetadata])

  const txSigning = Boolean(relayrBundle.uuid) && !relayrBundle.isComplete

  if (projectMetadata?.archived) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <Statistic
            title={<Trans>Project state</Trans>}
            valueRender={() => <Trans>Archived</Trans>}
          />

          <div>
            <p>
              <Trans>Unarchiving your project has the following effects:</Trans>
            </p>

            <ul className="list-disc pl-10">
              <li>
                <Trans>Your project will appear as 'active'.</Trans>
              </li>
              <li>
                <Trans>
                  Your project can receive payments through the juicebox.money
                  app.
                </Trans>
              </li>
            </ul>
          </div>

          <p>
            <Trans>
              Allow a few days for your project to appear in the "active" projects
              list on the Projects page.
            </Trans>
          </p>
          <div>
            <Button
              onClick={() => setArchived(false)}
              loading={loading}
              type="primary"
            >
              <span>
                <Trans>Unarchive project</Trans>
              </span>
            </Button>
          </div>
        </div>
        <TransactionModal
          open={modalOpen}
          title={<Trans>Confirm unarchive</Trans>}
          onOk={handleConfirm}
          okText={
            !isOmnichainProject ? (
              <Trans>Unarchive project</Trans>
            ) : !txQuote ? (
              <Trans>Get quote</Trans>
            ) : (
              <Trans>Unarchive project</Trans>
            )
          }
          confirmLoading={confirmLoading || txQuoteLoading || txSigning}
          transactionPending={txSigning}
          chainIds={isOmnichainProject ? projectChains : undefined}
          relayrResponse={relayrBundle.response}
          cancelButtonProps={{ hidden: true }}
          onCancel={() => setModalOpen(false)}
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
            <div className="py-4 text-sm">
              <Callout.Info>
                <Trans>
                  You'll be prompted a wallet signature for each of this project's chains before submitting the final transaction.
                </Trans>
              </Callout.Info>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-2">
                <span><Trans>Gas quote:</Trans></span>
                <ETHAmount amount={BigNumber.from(txQuote.payment_info.find((p) => Number(p.chain) === selectedGasChain)?.amount || '0')} />
              </div>
              <div className="flex justify-between">
                <span><Trans>Pay gas on:</Trans></span>
                <ChainSelect value={selectedGasChain} onChange={setSelectedGasChain} chainIds={projectChains} showTitle />
              </div>
            </>
          )}
        </TransactionModal>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Statistic
          title={<Trans>Project state</Trans>}
          valueRender={() => <Trans>Active</Trans>}
        />

        <div>
          <p>
            <Trans>Archiving your project has the following effects:</Trans>
          </p>

          <ul className="list-disc pl-10">
            <li>
              <Trans>Your project will appear as 'archived'.</Trans>
            </li>
            <li>
              <Trans>
                Your project can't receive payments through the juicebox.money
                app.
              </Trans>
            </li>
            <li>
              <Trans>
                Unless payments to this project are paused in your cycle's
                rules, your project can still receive payments directly through
                the Juicebox protocol contracts.
              </Trans>
            </li>
          </ul>
        </div>

        <div>
          <p>
            <Trans>
              Allow a few days for your project to appear in the "archived"
              projects list on the Projects page.
            </Trans>
          </p>

          <Callout.Info>
            <Trans>You can unarchive your project at any time.</Trans>
          </Callout.Info>
        </div>

        <div>
          <Button
            onClick={() => setArchived(true)}
            loading={loading}
            type="primary"
          >
            <span>
              <Trans>Archive project</Trans>
            </span>
          </Button>
        </div>
      </div>
      <TransactionModal
        open={modalOpen}
        title={<Trans>Confirm archive</Trans>}
        onOk={handleConfirm}
        okText={
          !isOmnichainProject ? (
            <Trans>Archive project</Trans>
          ) : !txQuote ? (
            <Trans>Get quote</Trans>
          ) : (
            <Trans>Archive project</Trans>
          )
        }
        confirmLoading={confirmLoading || txQuoteLoading || txSigning}
        transactionPending={txSigning}
        chainIds={isOmnichainProject ? projectChains : undefined}
        relayrResponse={relayrBundle.response}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setModalOpen(false)}
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
          <div className="py-4 text-sm">
            <Callout.Info>
              <Trans>
                You'll be prompted a wallet signature for each of this project's chains before submitting the final transaction.
              </Trans>
            </Callout.Info>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span><Trans>Gas quote:</Trans></span>
              <ETHAmount amount={BigNumber.from(txQuote.payment_info.find((p) => Number(p.chain) === selectedGasChain)?.amount || '0')} />
            </div>
            <div className="flex justify-between">
              <span><Trans>Pay gas on:</Trans></span>
              <ChainSelect value={selectedGasChain} onChange={setSelectedGasChain} chainIds={projectChains} showTitle />
            </div>
          </>
        )}
      </TransactionModal>
    </>
  )
}
