import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'
import { MAX_MINT_RATE } from 'utils/v2v3/math'

export default function MintRateFormItem({
  value,
  onChange,
  hasDuration,
  isCreate,
}: {
  value: string | undefined
  onChange: (newWeight: string | undefined) => void
  hasDuration: boolean
  isCreate: boolean
}) {
  return (
    <div className="flex">
      <Form.Item
        label={
          <TooltipLabel
            label={
              isCreate ? (
                <Trans>Initial mint rate</Trans>
              ) : (
                <Trans>Mint rate</Trans>
              )
            }
            tip={
              hasDuration && isCreate ? (
                <Trans>
                  The number of project tokens minted when 1 ETH is contributed
                  in the first funding cycle.
                </Trans>
              ) : (
                <Trans>
                  The number of project tokens minted when 1 ETH is contributed.
                </Trans>
              )
            }
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
              <Trans>tokens per ETH contributed</Trans>
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
