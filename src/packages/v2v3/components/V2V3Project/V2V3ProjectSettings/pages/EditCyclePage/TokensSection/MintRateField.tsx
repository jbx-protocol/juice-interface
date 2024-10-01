import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { MAX_MINT_RATE } from 'packages/v2v3/utils/math'

export function MintRateField() {
  return (
    <Form.Item name="mintRate">
      <FormattedNumberInput
        className="h-10 py-1 pr-4"
        min={0}
        defaultValue={0}
        max={MAX_MINT_RATE}
        accessory={
          <span className="mr-5 text-sm text-black dark:text-slate-100">
            <Trans>tokens per ETH paid</Trans>
          </span>
        }
        isInteger
      />
    </Form.Item>
  )
}
