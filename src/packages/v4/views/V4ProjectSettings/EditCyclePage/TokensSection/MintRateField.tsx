import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { MaxUint88 } from 'constants/numbers'

// @v4todo: add to SDK
const MAX_ISSUANCE_RATE = Math.floor(MaxUint88 / 10 ** 18) 

// Note: "MintRate" = "IssuanceRate"
export function MintRateField() {
  return (
    <Form.Item name="issuanceRate">
      <FormattedNumberInput
        className="h-10 py-1 pr-4"
        min={0}
        defaultValue={0}
        max={MAX_ISSUANCE_RATE}
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
