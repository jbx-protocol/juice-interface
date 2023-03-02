import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'
import { MINT_RATE_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
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
            label={<Trans>Token issuance rate</Trans>}
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
