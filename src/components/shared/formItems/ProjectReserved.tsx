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
  issuanceRate,
  isCreate,
}: {
  value: number | undefined
  style?: CSSProperties
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
  issuanceRate?: number
  isCreate?: boolean // Instance of this form item is in the create flow (not reconfig)
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
  const effectiveIssuanceRate = issuanceRate ?? DEFAULT_ISSUANCE_RATE

  // Reserved tokens received by project per ETH
  const initialReservedTokensPerEth =
    effectiveIssuanceRate * ((value ?? 0) / 100)

  // Tokens received by contributor's per ETH
  const contributorIssuanceRate =
    effectiveIssuanceRate - initialReservedTokensPerEth

  return (
    <Form.Item
      extra={
        <div style={{ fontSize: '0.9rem' }}>
          <p>
            <Trans>
              Reserve a percentage of freshly minted tokens for your project to
              use.
            </Trans>
          </p>
          {isCreate && (
            <TabDescription style={{ backgroundColor: colors.background.l1 }}>
              <Trans>
                For every <strong>1 ETH</strong> contributed,{' '}
                <strong style={{ whiteSpace: 'nowrap' }}>
                  {formattedNum(contributorIssuanceRate)} tokens
                </strong>{' '}
                will go to the contributor and{' '}
                <strong style={{ whiteSpace: 'nowrap' }}>
                  {formattedNum(initialReservedTokensPerEth)} tokens will be
                  reserved
                </strong>{' '}
                for the project.
              </Trans>
            </TabDescription>
          )}
        </div>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <>
            {shouldRenderToggle ? (
              <SwitchHeading checked={Boolean(checked)} onChange={onToggled}>
                <Trans>Reserved rate</Trans>
                {!Boolean(checked) && (
                  <span
                    style={{
                      color: colors.text.tertiary,
                    }}
                  >
                    {' '}
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
