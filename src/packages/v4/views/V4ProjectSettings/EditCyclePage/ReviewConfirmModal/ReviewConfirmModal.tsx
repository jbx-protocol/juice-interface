import { Trans, t } from '@lingui/macro'
import { JBChainId, NATIVE_TOKEN } from 'juice-sdk-core'
import { useJBChainId, useJBContractContext, useSuckers } from 'juice-sdk-react'
import { EditCycleTxArgs, transformEditCycleFormFieldsToTxArgs } from 'packages/v4/utils/editRuleset'
import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import TransactionModal from 'components/modals/TransactionModal'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useWallet } from 'hooks/Wallet'
import type { RelayrPostBundleResponse } from 'juice-sdk-react'
import moment from 'moment'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { CreateCollapse } from 'packages/v4/components/Create/components/CreateCollapse/CreateCollapse'
import QueueSafeEditRulesetTxsModal from 'packages/v4/components/QueueSafeEditRulesetTxsModal'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { emitErrorNotification } from 'utils/notifications'
import { useChainId } from 'wagmi'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { useOmnichainEditCycle } from '../hooks/useOmnichainEditCycle'
import { TransactionSuccessModal } from '../TransactionSuccessModal'
import { DetailsSectionDiff } from './DetailsSectionDiff'
import { useDetailsSectionValues } from './hooks/useDetailsSectionValues'
import { usePayoutsSectionValues } from './hooks/usePayoutsSectionValues'
import { useTokensSectionValues } from './hooks/useTokensSectionValues'
import { PayoutsSectionDiff } from './PayoutsSectionDiff'
import { SectionCollapseHeader } from './SectionCollapseHeader'
import { TokensSectionDiff } from './TokensSectionDiff'

export function ReviewConfirmModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const [editCycleSuccessModalOpen, setEditCycleSuccessModalOpen] =
    useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [safeModalOpen, setSafeModalOpen] = useState<boolean>(false)

  const { editCycleForm } = useEditCycleFormContext()

  const { sectionHasDiff: detailsSectionHasDiff } = useDetailsSectionValues()
  const { sectionHasDiff: payoutsSectionHasDiff } = usePayoutsSectionValues()
  const { sectionHasDiff: tokensSectionHasDiff } = useTokensSectionValues()

  const formHasChanges =
    detailsSectionHasDiff || payoutsSectionHasDiff || tokensSectionHasDiff

  const { changeNetworks } = useWallet()
  const chainId = useJBChainId()
  const walletChainId = useChainId()
  const walletConnectedToWrongChain = chainId !== walletChainId

  // Project owner and Gnosis Safe detection
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  const { data: gnosisSafeData } = useGnosisSafe(projectOwnerAddress)
  const isProjectOwnerGnosisSafe = Boolean(gnosisSafeData)

  // Omnichain edit state
  const { getEditQuote, sendRelayrTx, relayrBundle } = useOmnichainEditCycle()
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId | undefined>(chainId)
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)

  const { data: suckers } = useSuckers()

  const projectChains = suckers?.map(s => s.peerChainId) || []
  const isOmnichainProject = projectChains.length > 1

  const txQuoteCostHex = txQuote?.payment_info.find(p => Number(p.chain) === selectedGasChain)?.amount
  const txQuoteCost = txQuoteCostHex ? BigInt(txQuoteCostHex) : null

  // Fetch omnichain edit quote
  const { contracts } = useJBContractContext()

  const getQuote = async () => {
    setTxQuoteLoading(true)
    try {
      const formVals = editCycleForm!.getFieldsValue(true)
      if (!contracts.primaryNativeTerminal.data) throw new Error('Terminal not ready')
      
      const editData: Record<number, EditCycleTxArgs> = {}
      
      if (!suckers || suckers.length === 0) {
        throw new Error('No project chains available')
      }
      
      for (const sucker of suckers) {
        const chainId = sucker.peerChainId
        const chainProjectId = sucker.projectId
        
        // Calculate specific args for this chain using its projectId
        const chainArgs = transformEditCycleFormFieldsToTxArgs({
          formValues: formVals,
          primaryNativeTerminal: contracts.primaryNativeTerminal.data as `0x${string}`,
          tokenAddress: NATIVE_TOKEN as `0x${string}`,
          projectId: BigInt(chainProjectId),
        })
        
        editData[chainId as JBChainId] = chainArgs
      }
      
      const quote = await getEditQuote(editData, projectChains)
      setTxQuote(quote!)    
    } catch (e) {
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }

  const handleConfirmOmni = async () => {
    // Check if project owner is Gnosis Safe and project is omnichain
    if (isProjectOwnerGnosisSafe && isOmnichainProject) {
      setSafeModalOpen(true)
      return
    }

    // If quote isn't fetched yet, get it
    if (!txQuote) return getQuote()
    
    // Check if wallet is connected to the right chain
    if (walletConnectedToWrongChain && selectedGasChain) {
      try {
        await changeNetworks(selectedGasChain)
      } catch (error) {
        console.error(error)
        emitErrorNotification(`Error changing networks: ${error}`)
        return
      }
    }
    setConfirmLoading(true)
    try {
      // Find payment info for selected chain
      const payment = txQuote.payment_info.find(p => Number(p.chain) === selectedGasChain)
      if (!payment) {
        throw new Error('No payment info found for selected chain')
      }
      
      // Send the relayr transaction
      await sendRelayrTx(payment)
      // Start polling for transaction status
      relayrBundle.startPolling(txQuote.bundle_uuid)
      
    } catch (error) {
      console.error(error)
      emitErrorNotification(`Error launching ruleset: ${error}`)
    }
  }

  // Poll and handle completion
  useEffect(() => {
    if (relayrBundle.isComplete) {
      // Reset form and show success modal
      editCycleForm!.resetFields()
      setConfirmLoading(false)
      setEditCycleSuccessModalOpen(true)
      onClose()
    } else if (relayrBundle.error) {
      // Handle error
      console.error(relayrBundle.error)
      setConfirmLoading(false)
      emitErrorNotification(`Error deploying changes: ${relayrBundle.error}`)
    }
  }, [relayrBundle.isComplete, relayrBundle.error, editCycleForm, onClose])

  const panelProps = { className: 'text-lg' }

  const txSigning = Boolean(relayrBundle.uuid) && !relayrBundle.isComplete
  const okText = isProjectOwnerGnosisSafe ? <Trans>Queue on Safe</Trans> : !txQuote ? <Trans>Get edit quote</Trans> : <Trans>Deploy changes</Trans>

  return (
    <>      
      <TransactionModal
        open={open}
        title={<Trans>Review & confirm</Trans>}
        onOk={handleConfirmOmni}
        okText={okText}
        okButtonProps={{ disabled: !formHasChanges }}
        confirmLoading={confirmLoading || txQuoteLoading || txSigning}
        transactionPending={txSigning}
        chainIds={projectChains}
        relayrResponse={relayrBundle.response}
        cancelButtonProps={{ hidden: true }}
        onCancel={onClose}
      >           
        <CreateCollapse>
          <CreateCollapse.Panel
            key={0}
            header={
              <SectionCollapseHeader
                title={<Trans>Cycle details</Trans>}
                hasDiff={detailsSectionHasDiff}
              />
            }
            {...panelProps}
          >
            <DetailsSectionDiff />
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={
              <SectionCollapseHeader
                title={<Trans>Payouts</Trans>}
                hasDiff={payoutsSectionHasDiff}
              />
            }
            {...panelProps}
          >
            <PayoutsSectionDiff />
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={2}
            header={
              <SectionCollapseHeader
                title={<Trans>Tokens</Trans>}
                hasDiff={tokensSectionHasDiff}
              />
            }
            {...panelProps}
          >
            <TokensSectionDiff />
          </CreateCollapse.Panel>
        </CreateCollapse>
        <div className="mt-8 mb-1 font-medium">
          <Trans>
            Memo <span className="text-secondary font-normal">(optional)</span>
          </Trans>
        </div>
        <Form.Item name="memo">
          <JuiceTextArea
            rows={1}
            name="memo"
            placeholder={t`Add an on-chain note about this cycle.`}
            maxLength={256}
            showCount={true}
          />
        </Form.Item>
        {!txQuote && (
          <div className="mt-10 py-4 text-sm stroke-tertiary border-t rounded-none">
              <Callout.Info>
              {isProjectOwnerGnosisSafe && isOmnichainProject ? (
                <>
                <Trans>
                    Set your new ruleset to begin after you expect all required signatures and executions across every chain to be completed.
                </Trans>
                
                <Form.Item name="mustStartAtOrAfter" noStyle>
                <div className="mt-4">
                    <Form.Item 
                      name="mustStartAtOrAfter" 
                      label={<Trans>Ruleset must start at or after</Trans>}
                      noStyle
                    />
                    <JuiceDatePicker
                      showNow={false}
                      showToday={false}
                      format="YYYY-MM-DD HH:mm:ss"
                      value={editCycleForm?.getFieldValue('mustStartAtOrAfter') ? moment.unix(editCycleForm.getFieldValue('mustStartAtOrAfter')) : undefined}
                      onChange={(moment)=> {
                        if (moment) {
                          editCycleForm?.setFieldsValue({
                            mustStartAtOrAfter: moment.unix(),
                          })
                        }
                      }}
                      disabledDate={current => {
                        if (!current) return false
                        const now = moment()
                        if (
                          current.isSame(now, 'day') ||
                          current.isAfter(now, 'day')
                        )
                          return false
                        return true
                      }}
                      showTime={{ defaultValue: moment('00:00:00') }}
                    />
                    {/* </Form.Item> */}
                  </div>
                </Form.Item>
                </>
              ) : (
                <Trans>
                  You'll be prompted a wallet signature for each of this project's chains before submitting the final transaction.
                </Trans>
              )}
              </Callout.Info>
          </div>
        )}
        {txQuote ? (
          <div className="mb-4 mt-10">
            <div className="flex items-center justify-between">
              <span><Trans>Gas quote</Trans>:</span>
              <ETHAmount amount={txQuoteCost ? BigNumber.from(txQuoteCost.toString()) : BigNumber.from(0)} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span><Trans>Pay gas on:</Trans></span>
              <ChainSelect value={selectedGasChain} onChange={setSelectedGasChain} chainIds={projectChains} showTitle/>
            </div>
          </div>
        ): null}
      </TransactionModal>
      <TransactionSuccessModal
        open={editCycleSuccessModalOpen}
        onClose={() => setEditCycleSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your updated cycle has been deployed</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                Changes will take effect in your next cycle as long as it starts
                after your Rule change deadline.
              </Trans>
            </div>
          </>
        }
      />
      <QueueSafeEditRulesetTxsModal
        open={safeModalOpen}
        onCancel={() => {
          setSafeModalOpen(false)
        }}
        safeAddress={projectOwnerAddress || ''}
        formValues={editCycleForm?.getFieldsValue(true) || {}}
      />
    </>
  )
}
