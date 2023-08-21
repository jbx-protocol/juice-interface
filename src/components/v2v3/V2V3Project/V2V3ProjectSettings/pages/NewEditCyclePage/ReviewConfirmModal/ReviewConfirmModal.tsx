import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import { CreateCollapse } from 'components/Create/components/CreateCollapse'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import TransactionModal from 'components/modals/TransactionModal'
import { useSaveEditCycleData } from '../hooks/SaveEditCycleData'
import { DetailsSectionDiff } from './DetailsSectionDiff'
import { PayoutsSectionDiff } from './PayoutsSectionDiff'
import { SectionCollapseHeader } from './SectionCollapseHeader'
import { TokensSectionDiff } from './TokensSectionDiff'
import { useDetailsSectionValues } from './hooks/useDetailsSectionValues'
import { usePayoutsSectionValues } from './hooks/usePayoutsSectionValues'
import { useTokensSectionValues } from './hooks/useTokensSectionValues'

export function ReviewConfirmModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { saveEditCycleLoading, saveEditCycle } = useSaveEditCycleData()
  const { sectionHasDiff: detailsSectionHasDiff } = useDetailsSectionValues()
  const { sectionHasDiff: payoutsSectionHasDiff } = usePayoutsSectionValues()
  const { sectionHasDiff: tokensSectionHasDiff } = useTokensSectionValues()

  const onOk = () => {
    saveEditCycle()
  }
  const panelProps = { className: 'text-lg' }

  return (
    <TransactionModal
      open={open}
      title={<Trans>Review & confirm</Trans>}
      destroyOnClose
      onOk={onOk}
      okText={<Trans>Deploy changes</Trans>}
      onCancel={onClose}
      confirmLoading={saveEditCycleLoading}
    >
      <p className="text-secondary text-sm">
        <Trans>
          Please check your details carefully. Each change will incur a gas fee.
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
      <Form.Item name="memo" className="mt-10">
        <JuiceTextArea
          rows={4}
          placeholder={t`Add an on-chain note about this cycle.`}
          maxLength={256}
        />
      </Form.Item>
    </TransactionModal>
  )
}
