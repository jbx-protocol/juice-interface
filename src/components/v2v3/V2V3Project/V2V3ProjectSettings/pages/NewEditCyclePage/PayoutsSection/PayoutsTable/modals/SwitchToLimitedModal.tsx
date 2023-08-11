import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { ExternalLinkWithIcon } from 'components/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import CurrencySwitch from 'components/currency/CurrencySwitch'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useEditCycleFormContext } from '../../../EditCycleFormContext'
import { usePayoutsTable } from '../../hooks/usePayoutsTable'

export function SwitchToLimitedModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const [limit, setLimit] = useState<string>('')

  const { editCycleForm } = useEditCycleFormContext()
  const { setCurrency, currency } = usePayoutsTable()

  const onOk = () => {
    editCycleForm?.setFieldsValue({
      distributionLimit: parseFloat(limit),
    })
    onClose()
  }

  return (
    <Modal
      title={<Trans>Switch to limited payouts</Trans>}
      open={open}
      onCancel={onClose}
      onOk={onOk}
      okText={<Trans>Save</Trans>}
      destroyOnClose
    >
      <p>
        <Trans>
          Edit your cycles max. payout limit. Note that increases to the limit
          will take effect next cycle.
        </Trans>{' '}
        <ExternalLinkWithIcon href={helpPagePath(`/user/project/#payouts`)}>
          <Trans>Learn more about payout limits</Trans>
        </ExternalLinkWithIcon>
      </p>
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          <Trans>Payout limit (max.)</Trans>
        </span>
        <FormattedNumberInput
          className="flex-1"
          value={limit}
          onChange={val => setLimit(val ?? '0')}
          accessory={
            <CurrencySwitch
              currency={currency}
              onCurrencyChange={c =>
                setCurrency(c === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD)
              }
              className="rounded"
            />
          }
        />
      </div>
    </Modal>
  )
}
