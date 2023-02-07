import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormItemLabel from 'components/FormItemLabel'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import round from 'lodash/round'
import { useState } from 'react'
import {
  DEFAULT_FUNDING_CYCLE_METADATA,
  DEFAULT_MINT_RATE,
} from 'redux/slices/editingV2Project'
import { formattedNum } from 'utils/format/formatNumber'
import FormItemWarningText from '../FormItemWarningText'
import NumberSlider from '../inputs/NumberSlider'
import FundingCycleDetailWarning from '../Project/FundingCycleDetailWarning'
import SwitchHeading from '../SwitchHeading'
import TooltipLabel from '../TooltipLabel'
import { FormItemExt } from './formItemExt'

export default function ProjectReserved({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
  checked,
  onToggled,
  issuanceRate,
}: {
  value: number | undefined
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
  issuanceRate?: number
} & FormItemExt) {
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
  const effectiveIssuanceRate = issuanceRate ?? DEFAULT_MINT_RATE

  // Reserved tokens received by project per ETH
  const initialReservedTokensPerEth =
    effectiveIssuanceRate * ((value ?? 0) / 100)

  // Tokens received by contributor's per ETH
  const contributorIssuanceRate = round(
    effectiveIssuanceRate - initialReservedTokensPerEth,
    4,
  )

  return (
    <Form.Item
      extra={
        <div className="text-sm">
          <p>
            <Trans>
              Reserve a percentage of freshly minted tokens for your project to
              use.
            </Trans>
          </p>
          <div className="w-full bg-smoke-100 p-4 dark:bg-slate-600">
            <div className="mb-1 flex w-full justify-between">
              <span>
                <TooltipLabel
                  label={t`Contributor rate`}
                  tip={
                    <Trans>
                      Tokens <strong>contributors will receive</strong> when
                      they contribute 1 ETH.
                    </Trans>
                  }
                />
                :
              </span>
              {formattedNum(contributorIssuanceRate)} tokens / 1 ETH
            </div>
            <div className="flex w-full justify-between">
              <span>
                <TooltipLabel
                  label={t`Reserved rate`}
                  tip={
                    <Trans>
                      Tokens <strong>reserved for the project</strong> when 1
                      ETH is contributed.
                    </Trans>
                  }
                />
                :
              </span>
              {formattedNum(round(initialReservedTokensPerEth, 4))} tokens / 1
              ETH
            </div>
          </div>
        </div>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <>
            {onToggled ? (
              <SwitchHeading checked={Boolean(checked)} onChange={onToggled}>
                <Trans>Reserved tokens</Trans>
                {!checked && (
                  <span className="text-grey-400 dark:text-slate-200">
                    {' '}
                    ({DEFAULT_FUNDING_CYCLE_METADATA.reservedRate}%)
                  </span>
                )}
              </SwitchHeading>
            ) : (
              <FormItemLabel>
                <Trans>Reserved rate</Trans>
              </FormItemLabel>
            )}
            <div className="pb-3 pl-4">
              <FundingCycleDetailWarning
                showWarning={showRiskWarning}
                tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().metadataReservedRate}
              />
            </div>
          </>
        )
      }
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
