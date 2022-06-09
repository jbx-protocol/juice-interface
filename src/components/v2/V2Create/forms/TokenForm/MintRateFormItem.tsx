import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function MintRateFormItem({
  value,
  onChange,
  hasDuration,
  isCreate,
}: {
  value: string | undefined
  onChange: (newWeight: string | undefined) => void
  hasDuration: boolean
  isCreate: boolean // hidden in reconfig for now, but might have a difference version in reconfig at some point
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ display: 'flex' }}>
      {isCreate ? (
        <Form.Item
          label={
            <TooltipLabel
              label={<Trans>Initial mint rate</Trans>}
              tip={
                hasDuration ? (
                  <Trans>
                    The number of project tokens minted when 1 ETH is
                    contributed in the first funding cycle.
                  </Trans>
                ) : (
                  <Trans>
                    The number of project tokens minted when 1 ETH is
                    contributed.
                  </Trans>
                )
              }
            />
          }
          style={{ width: '100%' }}
          required
        >
          <FormattedNumberInput
            min={1}
            accessory={
              <span style={{ color: colors.text.primary, marginRight: 20 }}>
                <Trans>tokens per ETH contributed</Trans>
              </span>
            }
            value={value}
            onChange={onChange}
            style={{ paddingRight: 15 }}
          />
        </Form.Item>
      ) : null}
    </div>
  )
}
