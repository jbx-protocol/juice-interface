import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceListbox } from 'components/inputs/JuiceListbox'

import { DurationUnitsOption } from 'constants/time'

export default function DurationInputAndSelect() {
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
        <JuiceListbox
          className="h-8 min-w-[125px]"
          buttonClassName="py-1.5"
          options={DURATION_UNIT_OPTIONS_FC}
        />
      </Form.Item>
    </div>
  )
}

interface DurationUnitOptionFC {
  value: DurationUnitsOption
  label: string
}

export const DURATION_UNIT_OPTIONS_FC: DurationUnitOptionFC[] = [
  { value: 'days', label: t`Days` },
  { value: 'hours', label: t`Hours` },
  { value: 'minutes', label: t`Minutes` },
  { value: 'seconds', label: t`Seconds` },
]
