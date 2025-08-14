import { JBSplit, MAX_PAYOUT_LIMIT } from 'juice-sdk-core'

import { AdvancedDropdown } from 'components/Project/ProjectSettings/AdvancedDropdown'
import { CurrencyName } from 'constants/currency'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { PayoutsTable } from 'packages/v4/components/PayoutsTable/PayoutsTable'
import { Trans } from '@lingui/macro'
import { useEditCycleFormContext } from './EditCycleFormContext'
import { useWatch } from 'antd/lib/form/Form'

export function PayoutsSection() {
  const { editCycleForm } = useEditCycleFormContext()
  const payoutSplits = useWatch('payoutSplits', editCycleForm) ?? []
  const currency = useWatch('payoutLimitCurrency', editCycleForm) ?? 'ETH'
  const payoutLimit = useWatch('payoutLimit', editCycleForm)

  const setPayoutSplits = (payoutSplits: JBSplit[]) =>
    editCycleForm?.setFieldsValue({ payoutSplits })

  const setCurrency = (currency: CurrencyName) =>
    editCycleForm?.setFieldsValue({
      payoutLimitCurrency: currency,
    })

  const setPayoutLimit = (payoutLimit: number | undefined) =>
    editCycleForm?.setFieldsValue({ payoutLimit })

  const payoutLimitIsInfinite = payoutLimit === undefined || BigInt(payoutLimit) === MAX_PAYOUT_LIMIT
  return (
    <div className="flex flex-col gap-3">
      <PayoutsTable
        payoutSplits={payoutSplits}
        setPayoutSplits={setPayoutSplits}
        currency={currency}
        setCurrency={setCurrency}
        distributionLimit={payoutLimitIsInfinite ? undefined : payoutLimit}
        usdDisabled
        setDistributionLimit={setPayoutLimit}
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
