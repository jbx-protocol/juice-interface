import { ProjectDetailsForm, ProjectDetailsFormFields } from 'components/Project/ProjectSettings/ProjectDetailsForm'
import { RelayrPostBundleResponse, useJBProjectMetadataContext, useSuckers } from 'juice-sdk-react'
import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import TransactionModal from 'components/modals/TransactionModal'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { JBChainId } from 'juice-sdk-core'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { useEditProjectDetailsTx } from 'packages/v4v5/hooks/useEditProjectDetailsTx'
import { useOmnichainEditProjectDetailsTx } from 'packages/v4v5/hooks/useOmnichainEditProjectDetailsTx'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { withoutHttps } from 'utils/http'
import { emitErrorNotification } from 'utils/notifications'
import { TransactionSuccessModal } from '../EditCyclePage/TransactionSuccessModal'
import QueueSafeProjectDetailsTxsModal from './components/QueueSafeProjectDetailsTxsModal'

export function ProjectDetailsSettingsPage() {
  const { metadata } = useJBProjectMetadataContext()
  const projectMetadata = metadata.data

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  // Omnichain edit state
  const { getEditQuote, sendRelayrTx, relayrBundle } = useOmnichainEditProjectDetailsTx()
  const { data: suckers } = useSuckers()
  const projectChains = suckers?.map(s => s.peerChainId) || []
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId | undefined>(projectChains[0])
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cid, setCid] = useState<`0x${string}`>()
  const [successOpen, setSuccessOpen] = useState(false)
  const [safeModalOpen, setSafeModalOpen] = useState(false)

  // Project owner and Gnosis Safe detection
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const { data: gnosisSafeData } = useGnosisSafe(projectOwnerAddress)
  const isProjectOwnerGnosisSafe = Boolean(gnosisSafeData)
  const isOmnichainProject = projectChains.length > 1

  const editProjectDetailsTx = useEditProjectDetailsTx()

  const onProjectFormSaved = useCallback(async () => {
    setLoadingSaveChanges(true)

    // upload metadata
    const fields = projectForm.getFieldsValue(true)
    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      name: fields.name,
      description: fields.description,
      projectTagline: fields.projectTagline,
      projectRequiredOFACCheck: fields.projectRequiredOFACCheck,
      logoUri: fields.logoUri,
      coverImageUri: fields.coverImageUri,
      infoUri: fields.infoUri,
      twitter: fields.twitter,
      discord: fields.discord,
      telegram: fields.telegram,
      payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
      payDisclosure: fields.payDisclosure,
      tags: fields.tags,
    })

    if (!uploadedMetadata.Hash) {
      setLoadingSaveChanges(false)
      return
    }

    const hash = uploadedMetadata.Hash as `0x${string}`
    setCid(hash)
    setLoadingSaveChanges(false)

    // Check if project owner is Gnosis Safe and project is omnichain
    if (isProjectOwnerGnosisSafe && isOmnichainProject) {
      setSafeModalOpen(true)
    } else {
      setModalOpen(true)
    }
  }, [
    projectForm,
    projectMetadata,
    isProjectOwnerGnosisSafe,
    isOmnichainProject,
  ])

  // request omnichain quote
  const handleGetQuote = async () => {
    setTxQuoteLoading(true)
    try {
      const quote = await getEditQuote(cid!)
      setTxQuote(quote)
    } catch (e) {
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }

  // confirm omnichain save
  const handleConfirm = async () => {
    if (!isOmnichainProject) {
      // Use single-chain transaction for non-omnichain projects
      return handleSingleChainSave()
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

  // handle single-chain save using original editProjectDetailsTx
  const handleSingleChainSave = useCallback(async () => {
    if (!cid) return
    
    setConfirmLoading(true)
    try {
      await editProjectDetailsTx(cid, {
        onTransactionPending: () => {
          // Transaction pending
        },
        onTransactionConfirmed: () => {
          projectForm.resetFields()
          setConfirmLoading(false)
          setModalOpen(false)
          setSuccessOpen(true)
        },
        onTransactionError: (error) => {
          console.error('Transaction error:', error)
          emitErrorNotification(`Failed to save project details: ${error.message}`)
          setConfirmLoading(false)
        }
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to save project details', error)
      emitErrorNotification(`Failed to save project details: ${errorMessage}`)
      setConfirmLoading(false)
    }
  }, [cid, editProjectDetailsTx, projectForm])

  // poll for completion
  useEffect(() => {
    if (relayrBundle.isComplete) {
      projectForm.resetFields()
      // refresh project metadata to pick up updated OFAC setting
      setConfirmLoading(false)
      setModalOpen(false)
      setSuccessOpen(true)
    } else if (relayrBundle.error) {
      emitErrorNotification(relayrBundle.error as string)
      setConfirmLoading(false)
    }
  }, [relayrBundle.isComplete, relayrBundle.error, projectForm])

  const resetProjectForm = useCallback(() => {
    const infoUri = withoutHttps(projectMetadata?.infoUri ?? '')
    const discord = withoutHttps(projectMetadata?.discord ?? '')
    const telegram = withoutHttps(projectMetadata?.telegram ?? '')
    projectForm.setFieldsValue({
      name: projectMetadata?.name ?? '',
      infoUri,
      logoUri: projectMetadata?.logoUri ?? '',
      coverImageUri: projectMetadata?.coverImageUri ?? '',
      description: projectMetadata?.description ?? '',
      projectTagline: projectMetadata?.projectTagline ?? '',
      projectRequiredOFACCheck: projectMetadata?.projectRequiredOFACCheck ?? false,
      twitter: projectMetadata?.twitter ?? '',
      discord,
      telegram,
      payButton: projectMetadata?.payButton ?? '',
      payDisclosure: projectMetadata?.payDisclosure ?? '',
      tags: projectMetadata?.tags ?? [],
    })
  }, [
    projectForm,
    projectMetadata?.name,
    projectMetadata?.infoUri,
    projectMetadata?.logoUri,
    projectMetadata?.coverImageUri,
    projectMetadata?.description,
    projectMetadata?.projectTagline,
    projectMetadata?.projectRequiredOFACCheck,
    projectMetadata?.twitter,
    projectMetadata?.discord,
    projectMetadata?.telegram,
    projectMetadata?.payButton,
    projectMetadata?.payDisclosure,
    projectMetadata?.tags,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    // Bug with antd - required to make sure form is reset after initial render
    setTimeout(() => {
      resetProjectForm()
    }, 0)
  }, [resetProjectForm])

  const txSigning = Boolean(relayrBundle.uuid) && !relayrBundle.isComplete

  return (
    <>
      <ProjectDetailsForm
        form={projectForm}
        onFinish={onProjectFormSaved}
        hideProjectHandle
        loading={loadingSaveChanges}
      />
      <TransactionModal
        open={modalOpen}
        title={<Trans>Confirm changes</Trans>}
        onOk={handleConfirm}
        okText={
          !isOmnichainProject ? (
            <Trans>Save changes</Trans>
          ) : !txQuote ? (
            <Trans>Get edit quote</Trans>
          ) : (
            <Trans>Save changes</Trans>
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
      <TransactionSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        content={
          <div className="text-center">
            <Trans>Your project details have been updated across all chains.</Trans>
          </div>
        }
      />
      <QueueSafeProjectDetailsTxsModal
        open={safeModalOpen}
        onCancel={() => setSafeModalOpen(false)}
        form={projectForm}
        projectMetadata={projectMetadata ?? undefined}
      />
    </>
  )
}
