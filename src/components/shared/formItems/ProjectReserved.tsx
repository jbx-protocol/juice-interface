import { Form, Switch } from 'antd'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import FundingCycleDetailWarning from '../Project/FundingCycleDetailWarning'
import FormItemWarningText from '../FormItemWarningText'

export default function ProjectReserved({
  name,
  hideLabel,
  formItemProps,
  value,
  style = {},
  onChange,
  checked,
  onToggled,
}: {
  value: number | undefined
  style?: CSSProperties
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [showRiskWarning, setShowRiskWarning] = useState<boolean>(
    (value ?? 0) > RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
  )

  const riskNotice = (
    <FormItemWarningText>
      <Trans>
        A reserved rate of more than 90% is risky for contributors. Contributors
        won't receive many tokens for their contribution.
      </Trans>
    </FormItemWarningText>
  )

  return (
    <Form.Item
      extra={
        <Trans>
          Whenever someone pays your project, this percentage of tokens will be
          reserved and the rest will go to the payer. By default, these tokens
          are reserved for the project owner, but you can also allocate portions
          to other wallet addresses. Anyone can submit the transaction to
          distribute reserved tokens according to the allocation.
        </Trans>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <FormItemLabel>
                <Trans>Reserved rate</Trans>
              </FormItemLabel>
              {onToggled ? (
                <>
                  <Switch checked={checked} onChange={onToggled} />{' '}
                  {!checked ? (
                    <span
                      style={{ color: colors.text.tertiary, marginLeft: 10 }}
                    >
                      <Trans>(0%)</Trans>
                    </span>
                  ) : null}
                </>
              ) : null}
            </div>
            <div style={{ paddingBottom: 11, paddingLeft: 14 }}>
              <FundingCycleDetailWarning
                showWarning={showRiskWarning}
                tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().metadataReservedRate}
              />
            </div>
          </>
        )
      }
      style={style}
      {...formItemProps}
    >
      {checked ? (
        <NumberSlider
          sliderValue={value}
          defaultValue={value ?? 0}
          suffix="%"
          onChange={value => {
            setShowRiskWarning(
              (value ?? 0) > RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
            )
            onChange(value)
          }}
          name={name}
          step={0.5}
          formItemProps={showRiskWarning ? { extra: riskNotice } : {}}
        />
      ) : null}
    </Form.Item>
  )
}
