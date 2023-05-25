import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { durationOptions } from 'components/inputs/DurationInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceListbox } from 'components/inputs/JuiceListbox'

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
          options={durationOptions()}
        />
      </Form.Item>
    </div>
  )
}
