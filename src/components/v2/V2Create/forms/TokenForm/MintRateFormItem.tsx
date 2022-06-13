import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { MAX_MINT_RATE } from 'utils/v2/math'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ display: 'flex' }}>
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
        style={{ width: '100%' }}
        required
      >
        <FormattedNumberInput
          min={1}
          max={MAX_MINT_RATE}
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
    </div>
  )
}
