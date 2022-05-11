import { Form } from 'antd'
import { Trans } from '@lingui/macro'
import { CSSProperties, useContext, useState } from 'react'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'
import TabDescription from 'components/v2/V2Create/TabDescription'
import { formattedNum } from 'utils/formatNumber'
import { ThemeContext } from 'contexts/themeContext'
import { defaultFundingCycleMetadata } from 'redux/slices/editingV2Project'
import { DEFAULT_ISSUANCE_RATE } from 'utils/v2/math'

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
  isCreate,
}: {
  value: number | undefined
  style?: CSSProperties
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
  isCreate?: boolean // Instance of this form item is in the create flow (not reconfig)
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

  // Reserved tokens received by project per ETH
  const initialReservedTokensPerEth =
    DEFAULT_ISSUANCE_RATE * ((value ?? 0) / 100)

  // Tokens received by contributor's per ETH
  const initialIssuanceRate =
    DEFAULT_ISSUANCE_RATE - initialReservedTokensPerEth
  return (
    <Form.Item
      extra={
        <div style={{ fontSize: '0.9rem' }}>
          {isCreate && (
            <TabDescription>
              <Trans>
                Initial issuance rate will be{' '}
                {formattedNum(initialIssuanceRate)} tokens / 1 ETH for
                contributors. {formattedNum(initialReservedTokensPerEth)} tokens
                / 1 ETH will be reserved by the project.
              </Trans>
            </TabDescription>
          )}
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
        </div>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <>
            {onToggled ? (
              <SwitchHeading checked={Boolean(checked)} onChange={onToggled}>
                <Trans>Reserved rate</Trans>
                {checked && (
                  <span
                    style={{
                      color: colors.text.tertiary,
                      marginLeft: 15,
                    }}
                  >
                    ({defaultFundingCycleMetadata.reservedRate}%)
                  </span>
                )}
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
      {checked && (
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
      )}
    </Form.Item>
  )
}
