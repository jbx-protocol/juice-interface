import { Trans, t } from '@lingui/macro'

import { Form } from 'antd'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import TransactionModal from 'components/modals/TransactionModal'
import { useWallet } from 'hooks/Wallet'
import { useJBChainId } from 'juice-sdk-react'
import { CreateCollapse } from 'packages/v4/components/Create/components/CreateCollapse/CreateCollapse'
import { useEditRulesetTx } from 'packages/v4/hooks/useEditRulesetTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { useChainId } from 'wagmi'
import { useEditCycleFormContext } from '../EditCycleFormContext'
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

  const { editCycleForm } = useEditCycleFormContext()

  const { sectionHasDiff: detailsSectionHasDiff } = useDetailsSectionValues()
  const { sectionHasDiff: payoutsSectionHasDiff } = usePayoutsSectionValues()
  const { sectionHasDiff: tokensSectionHasDiff } = useTokensSectionValues()

  const formHasChanges =
    detailsSectionHasDiff || payoutsSectionHasDiff || tokensSectionHasDiff

  const editRulesetTx = useEditRulesetTx()

  const { changeNetworks } = useWallet()
  const chainId = useJBChainId()
  const walletChainId = useChainId()
  const walletConnectedToWrongChain = chainId !== walletChainId

  const handleConfirm = async () => {
    setConfirmLoading(true)

    if (walletConnectedToWrongChain) {
      if (chainId) {
        try {
          await changeNetworks(chainId)
          setConfirmLoading(false)
        } catch (error) {
          console.error(error)
          setConfirmLoading(false)
          emitErrorNotification(`Error changing networks: ${error}`)
        }
        return
      }
    }

    editRulesetTx(editCycleForm?.getFieldsValue(true), {
      onTransactionPending: () => null,
      onTransactionConfirmed: () => {
        editCycleForm?.resetFields()
        setConfirmLoading(false)
        setEditCycleSuccessModalOpen(true)
        onClose()
      },
      onTransactionError: (error: unknown) => {
        console.error(error)
        setConfirmLoading(false)
        emitErrorNotification(`Error launching ruleset: ${error}`)
      },
    })
  }

  const panelProps = { className: 'text-lg' }

  return (
    <>
      <TransactionModal
        open={open}
        title={<Trans>Review & confirm</Trans>}
        destroyOnClose
        onOk={handleConfirm}
        okText={
          walletConnectedToWrongChain ? (
            <Trans>Change networks to deploy</Trans>
          ) : (
            <Trans>Deploy changes</Trans>
          )
        }
        okButtonProps={{ disabled: !formHasChanges }}
        cancelButtonProps={{ hidden: true }}
        onCancel={onClose}
        confirmLoading={confirmLoading}
      >
        <p className="text-secondary text-sm">
          <Trans>
            Check your changes carefully. Each deploy will incur a gas fee.
          </Trans>
        </p>
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
            rows={4}
            name="memo"
            placeholder={t`Add an on-chain note about this cycle.`}
            maxLength={256}
            showCount={true}
          />
        </Form.Item>
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
    </>
  )
}
