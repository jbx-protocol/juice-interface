import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import { CreateCollapse } from 'components/Create/components/CreateCollapse'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import TransactionModal from 'components/modals/TransactionModal'
import { useSaveEditCycleData } from '../hooks/SaveEditCycleData'
import { DetailsSectionDiff } from './DetailsSectionDiff'
import { PayoutsSectionDiff } from './PayoutsSectionDiff'

export function ReviewConfirmModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { saveEditCycleLoading, saveEditCycle } = useSaveEditCycleData()

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
        <CreateCollapse.Panel key={0} header={t`Cycle details`} {...panelProps}>
          <DetailsSectionDiff />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel key={1} header={t`Payouts`} {...panelProps}>
          <PayoutsSectionDiff />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel key={2} header={t`Tokens`} {...panelProps}>
          <>Details diff</>
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
