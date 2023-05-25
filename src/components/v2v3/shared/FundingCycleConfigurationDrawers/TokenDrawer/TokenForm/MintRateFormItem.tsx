import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { MINT_RATE_EXPLANATION } from 'components/strings'
import { MAX_MINT_RATE } from 'utils/v2v3/math'

export default function MintRateFormItem({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (newWeight: string | undefined) => void
}) {
  return (
    <div className="flex">
      <Form.Item
        label={
          <TooltipLabel
            label={<Trans>Total issuance rate</Trans>}
            tip={MINT_RATE_EXPLANATION}
          />
        }
        className="w-full"
        required
      >
        <FormattedNumberInput
          className="pr-4"
          min={0}
          max={MAX_MINT_RATE}
          accessory={
            <span className="mr-5 text-black dark:text-slate-100">
              <Trans>tokens per ETH paid</Trans>
            </span>
          }
          value={value}
          onChange={onChange}
          isInteger
        />
      </Form.Item>
    </div>
  )
}
