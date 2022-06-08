import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import {
  DurationUnitsOption,
  durationUnitText,
  DURATION_UNIT_OPTIONS,
} from 'constants/time'

export default function DurationInputAndSelect({
  defaultDurationUnit,
}: {
  defaultDurationUnit: DurationUnitsOption | undefined
}) {
  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name="duration"
        label={<Trans>Funding cycle duration</Trans>}
        style={{ width: '100%' }}
        required
      >
        <FormattedNumberInput
          placeholder="30"
          min={1}
          style={{ paddingRight: 15 }}
        />
      </Form.Item>
      <Form.Item name="durationUnit" label={<span></span>}>
        <Select
          className="medium"
          style={{
            minWidth: 125,
            height: 32,
          }}
          defaultValue={defaultDurationUnit}
        >
          {DURATION_UNIT_OPTIONS.map(value => (
            <Select.Option key={value} value={value}>
              {durationUnitText(value)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  )
}
