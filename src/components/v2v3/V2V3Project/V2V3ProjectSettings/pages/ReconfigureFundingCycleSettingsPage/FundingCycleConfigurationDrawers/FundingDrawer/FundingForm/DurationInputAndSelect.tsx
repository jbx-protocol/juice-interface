import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

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
    <div className="flex">
      <Form.Item
        name="duration"
        label={<Trans>Funding cycle duration</Trans>}
        className="w-full"
        required
      >
        <FormattedNumberInput className="pr-4" placeholder="30" min={1} />
      </Form.Item>
      <Form.Item name="durationUnit" label={<span></span>}>
        <Select
          className="medium h-8 min-w-[125px]"
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
