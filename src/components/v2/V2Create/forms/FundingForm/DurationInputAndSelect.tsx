import { Form, Select } from 'antd'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import {
  DurationUnitsOption,
  durationUnitText,
  DURATION_UNIT_OPTIONS,
} from 'constants/time'

export default function DurationInputAndSelect({
  value,
}: {
  value: DurationUnitsOption | undefined
}) {
  return (
    <>
      <Form.Item
        name="duration"
        required
        style={{ width: '100%', paddingRight: 15 }}
      >
        <FormattedNumberInput placeholder="30" min={1} />
      </Form.Item>
      <Form.Item name="durationUnit">
        <Select
          className="medium"
          style={{
            minWidth: '100px',
            height: '32px',
          }}
          defaultValue={value}
        >
          {DURATION_UNIT_OPTIONS.map((value, i) => (
            <Select.Option key={i} value={value}>
              {durationUnitText(value)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  )
}
