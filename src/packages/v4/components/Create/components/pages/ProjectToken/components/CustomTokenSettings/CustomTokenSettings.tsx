import * as ProjectTokenForm from '../../hooks/useProjectTokenForm'

import { Trans, t } from '@lingui/macro'
import { Divider, Form } from 'antd'
import {
  CASH_OUT_TAX_RATE_EXPLANATION,
  MINT_RATE_EXPLANATION,
  OWNER_MINTING_EXPLANATION,
  OWNER_MINTING_RISK,
  PAUSE_TRANSFERS_EXPLANATION,
} from 'components/strings'
import { MAX_MINT_RATE, redemptionRateFrom } from 'packages/v2v3/utils/math'

import { Callout } from 'components/Callout/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { AdvancedDropdown } from 'components/Project/ProjectSettings/AdvancedDropdown'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import useMobile from 'hooks/useMobile'
import { formatFundingCycleDuration } from 'packages/v2v3/components/Create/utils/formatFundingCycleDuration'
import { ReservedTokensList } from 'packages/v2v3/components/shared/ReservedTokensList'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useCallback } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useCreatingDistributionLimit } from 'redux/hooks/v2v3/create'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { inputMustExistRule } from 'utils/antdRules'
import { formatAmount } from 'utils/format/formatAmount'
import { ProjectTokensFormProps } from '../../hooks/useProjectTokenForm'
import { ReservedTokenRateCallout } from './ReservedTokenRateCallout'

const calculateMintRateAfterDiscount = ({
  mintRate,
  discountRate,
}: {
  mintRate: number
  discountRate: number
}) => {
  return mintRate * (1 - discountRate / 100)
}

export const CustomTokenSettings = () => {
  const isMobile = useMobile()
  const duration = useAppSelector(
    state => state.creatingV2Project.fundingCycleData.duration,
  )
  const [distributionLimit] = useCreatingDistributionLimit()
  const form = Form.useFormInstance<ProjectTokensFormProps>()
  const discountRate =
    Form.useWatch('discountRate', form) ??
    ProjectTokenForm.DefaultSettings.discountRate
  const initialMintRate = parseInt(
    Form.useWatch('initialMintRate', form) ??
      ProjectTokenForm.DefaultSettings.initialMintRate,
  )
  const cashOutTaxRate = Form.useWatch('redemptionRate', form) ?? 0
  const tokenMinting = Form.useWatch('tokenMinting', form) ?? false

  const handleEnableCashOutsChange = useCallback((enabled: boolean) => {
    const newCashOutRate = enabled ? 0 : 100
    form.setFieldValue('redemptionRate', newCashOutRate)
    creatingV2ProjectActions.setRedemptionRate(
      redemptionRateFrom(newCashOutRate).toHexString()
    )
  }, [form])

  const discountRateDisabled = !parseInt(duration)

  const cashOutTaxRateDisabled = distributionLimit?.amount.eq(MAX_PAYOUT_LIMIT)

  const initalMintRateAccessory = (
    <span className="mr-5">
      <Trans>Tokens per ETH contributed</Trans>
    </span>
  )

  const secondFundingCycleMintRate = calculateMintRateAfterDiscount({
    mintRate: initialMintRate,
    discountRate,
  })
  const thirdFundingCycleMintRate = calculateMintRateAfterDiscount({
    mintRate: secondFundingCycleMintRate,
    discountRate,
  })

  return (
    <>
      <Form.Item
        name="initialMintRate"
        label={t`Total issuance rate`}
        tooltip={MINT_RATE_EXPLANATION}
        extra={isMobile ? initalMintRateAccessory : undefined}
      >
        <FormattedNumberInput
          min={0}
          max={MAX_MINT_RATE}
          accessory={!isMobile ? initalMintRateAccessory : undefined}
        />
      </Form.Item>

      <Divider className="my-8" />

      <Form.Item label={t`Reserved percent`}>
        <div className="flex flex-col gap-6">
          <Trans>
            Set aside a percentage of token issuance for the wallets and
            Juicebox projects of your choosing.
          </Trans>
          <Form.Item
            noStyle
            name="reservedTokensPercentage"
            valuePropName="sliderValue"
            rules={[inputMustExistRule({ label: t`A reserved rate` })]}
          >
            <NumberSlider min={0} defaultValue={0} suffix="%" step={0.5} />
          </Form.Item>
          <ReservedTokenRateCallout />
        </div>
      </Form.Item>
      <Form.Item label={t`Reserved token recipients`} requiredMark="optional">
        <div className="flex flex-col gap-7">
          <Trans>
            Send a percentage of reserved tokens to the wallets and Juicebox
            projects of your choosing. By default, reserved tokens are sent to
            the project owner.
          </Trans>
          <Form.Item
            noStyle
            name="reservedTokenAllocation"
            rules={[
              inputMustExistRule({
                label: t`One or more reserved token recipients`,
              }),
            ]}
          >
            <ReservedTokensList isEditable />
          </Form.Item>
        </div>
      </Form.Item>

      <Divider className="mt-8 mb-0" />

      <AdvancedDropdown className='mt-0'>
        <Form.Item label={t`Issuance cut percent`}>
          <div className="flex flex-col gap-6">
            <span>
              <Trans>
                The issuance rate is reduced by this percentage every ruleset
                (every <strong>{formatFundingCycleDuration(duration)}</strong>).
                The higher this rate, the more incentive to pay this project
                earlier.
              </Trans>
            </span>
            <Form.Item
              noStyle
              name="discountRate"
              valuePropName="sliderValue"
              rules={[
                inputMustExistRule({ label: t`An issuance cut percent` }),
              ]}
            >
              <NumberSlider
                disabled={discountRateDisabled}
                min={0}
                defaultValue={0}
                suffix="%"
                step={0.5}
              />
            </Form.Item>
            {discountRateDisabled ? (
              <Callout.Warning>
                <Trans>
                  The issuance cut percent is disabled if you are using
                  unlocked rulesets (because they have no duration).
                </Trans>
              </Callout.Warning>
            ) : (
              <Callout.Info>
                {discountRate === 0 ? (
                  <Trans>
                    The issuance rate will not change unless you edit it. There
                    will be less of an incentive to support this project early on.
                  </Trans>
                ) : discountRate === 100 ? (
                  <Trans>
                    After {formatFundingCycleDuration(duration)} (your first
                    ruleset), your project will not issue any tokens unless you
                    edit the issuance rate.
                  </Trans>
                ) : (
                  <>
                    <p>
                      <Trans>
                        Each ruleset, the project will issue {discountRate}% fewer
                        tokens per ETH.{' '}
                      </Trans>
                    </p>
                    <p>
                      <Trans>
                        Next ruleset, the project will issue{' '}
                        {formatAmount(secondFundingCycleMintRate)} tokens per 1
                        ETH. The ruleset after that, the project will issue{' '}
                        {formatAmount(thirdFundingCycleMintRate)} tokens per 1
                        ETH.
                      </Trans>
                    </p>
                  </>
                )}
              </Callout.Info>
            )}
          </div>
        </Form.Item>

        <Divider className="my-8" />

        <Form.Item label={t`Cash out tax rate`}>
          <div className="flex flex-col gap-6">
            <Form.Item className="mt-2 mb-0" name="enableCashOuts" extra={t`When enabled, token holders can cash out their tokens for a portion of the project's ETH treasury.`}
>
              <JuiceSwitch 
                label={t`Enable cash outs`}
                onChange={handleEnableCashOutsChange}
              />
            </Form.Item>
            
            {Form.useWatch('enableCashOuts', form) && (
              <>
                <span>{CASH_OUT_TAX_RATE_EXPLANATION}</span>
                <Form.Item
                  noStyle
                  name="redemptionRate"
                  valuePropName="sliderValue"
                  rules={[inputMustExistRule({ label: t`A cash out tax rate` })]}
                >
                  <NumberSlider
                    min={0}
                    defaultValue={0}
                    suffix="%"
                    step={0.5}
                    disabled={cashOutTaxRateDisabled}
                  />
                </Form.Item>
                {cashOutTaxRateDisabled ? (
                  <Callout.Warning>
                    <Trans>
                      Cash outs are disabled when all of the project's ETH is being
                      used for payouts (when payouts are unlimited).
                    </Trans>
                  </Callout.Warning>
                ) : (
                  !isMobile && (
                      <TokenRedemptionRateGraph 
                        value={100 - cashOutTaxRate}
                        graphPad={50} 
                        graphSize={300} 
                      />
                  )
                )}
              </>
            )}
            
            {!Form.useWatch('enableCashOuts', form) && (
              <Callout.Info>
                <Trans>
                  Cash outs are disabled. Token holders will not be able to redeem their tokens for ETH.
                </Trans>
              </Callout.Info>
            )}
          </div>
        </Form.Item>

        <Divider className="my-8" />

        <div className="flex flex-col gap-y-5">
          <div>
            <Form.Item extra={OWNER_MINTING_EXPLANATION} name="tokenMinting">
              <JuiceSwitch label={t`Owner token minting`} />
            </Form.Item>
            {tokenMinting && (
              <Callout.Warning className="mb-5">
                {OWNER_MINTING_RISK}
              </Callout.Warning>
            )}
          </div>

          <Form.Item name="pauseTransfers" extra={PAUSE_TRANSFERS_EXPLANATION}>
            <JuiceSwitch label={t`Pause token transfers`} />
          </Form.Item>
        </div>
      </AdvancedDropdown>
    </>
  )
}
