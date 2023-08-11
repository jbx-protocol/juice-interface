import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import PayoutsTable from './PayoutsTable'

export function PayoutsSection() {
  const { editCycleForm } = useEditCycleFormContext()
  const payoutSplits = useWatch('payoutSplits', editCycleForm) ?? []
  const currency = useWatch('distributionLimitCurrency', editCycleForm) ?? 'ETH'
  const distributionLimit = useWatch('distributionLimit', editCycleForm) ?? 0

  const setPayoutSplits = (payoutSplits: Split[]) =>
    editCycleForm?.setFieldsValue({ payoutSplits })

  const setCurrency = (currency: CurrencyName) =>
    editCycleForm?.setFieldsValue({
      distributionLimitCurrency: currency,
    })

  const setDistributionLimit = (distributionLimit: number | undefined) =>
    editCycleForm?.setFieldsValue({ distributionLimit })

  return (
    <div className="flex flex-col gap-3">
      <PayoutsTable
        payoutSplits={payoutSplits}
        setPayoutSplits={setPayoutSplits}
        currency={currency}
        setCurrency={setCurrency}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
      />
      <AdvancedDropdown>
        {/* "Enable unlimited payouts" switch? */}
        <Form.Item name="holdFees">
          <JuiceSwitch
            label={<Trans>Hold fees in project</Trans>}
            description={
              <Trans>
                Fees are held in the project instead of being processed
                automatically.
              </Trans>
            }
          />
        </Form.Item>
      </AdvancedDropdown>
    </div>
  )
}
