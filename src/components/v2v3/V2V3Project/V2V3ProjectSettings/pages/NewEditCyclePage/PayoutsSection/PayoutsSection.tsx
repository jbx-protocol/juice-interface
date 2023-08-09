import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { PayoutsTable } from './PayoutsTable/PayoutsTable'

export function PayoutsSection() {
  return (
    <div className="flex flex-col gap-3">
      <PayoutsTable />
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
