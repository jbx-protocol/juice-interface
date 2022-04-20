import { Form } from 'antd'
import { Trans } from '@lingui/macro'
import { CSSProperties, useState } from 'react'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import FundingCycleDetailWarning from '../Project/FundingCycleDetailWarning'
import FormItemWarningText from '../FormItemWarningText'
import SwitchHeading from '../SwitchHeading'

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
  const shouldRenderToggle = Boolean(onToggled)

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
        <>
          <p>
            <Trans>
              Whenever someone pays your project, this percentage of tokens will
              be reserved and the rest will go to the payer.
            </Trans>
          </p>
          <p style={{ margin: 0 }}>
            <Trans>
              By default, these tokens are reserved for the project owner, but
              you can also allocate portions to other wallet addresses.
            </Trans>
          </p>
        </>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <>
            {shouldRenderToggle ? (
              <SwitchHeading checked={Boolean(checked)} onChange={onToggled}>
                <Trans>Reserved rate</Trans>
              </SwitchHeading>
            ) : (
              <FormItemLabel>
                <Trans>Reserved rate</Trans>
              </FormItemLabel>
            )}
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
        disabled={!checked}
      />
    </Form.Item>
  )
}
