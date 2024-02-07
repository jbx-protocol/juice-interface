import { t, Trans } from '@lingui/macro'
import { Divider, Form } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import {
  MINT_RATE_EXPLANATION,
  OWNER_MINTING_EXPLANATION,
  OWNER_MINTING_RISK,
  PAUSE_TRANSFERS_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from 'components/strings'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import { ReservedTokensList } from 'components/v2v3/shared/ReservedTokensList'
import useMobile from 'hooks/useMobile'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { inputMustExistRule } from 'utils/antdRules'
import { formatAmount } from 'utils/format/formatAmount'
import { MAX_DISTRIBUTION_LIMIT, MAX_MINT_RATE } from 'utils/v2v3/math'
import * as ProjectTokenForm from '../../hooks/useProjectTokenForm'
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
    state => state.editingV2Project.fundingCycleData.duration,
  )
  const [distributionLimit] = useEditingDistributionLimit()
  const form = Form.useFormInstance<ProjectTokensFormProps>()
  const discountRate =
    Form.useWatch('discountRate', form) ??
    ProjectTokenForm.DefaultSettings.discountRate
  const initialMintRate = parseInt(
    Form.useWatch('initialMintRate', form) ??
      ProjectTokenForm.DefaultSettings.initialMintRate,
  )
  const tokenMinting = Form.useWatch('tokenMinting', form) ?? false

  const discountRateDisabled = !parseInt(duration)

  const redemptionRateDisabled = distributionLimit?.amount.eq(
    MAX_DISTRIBUTION_LIMIT,
  )

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

      <Form.Item label={t`Reserved rate`}>
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

      <Divider className="my-8" />

      <Form.Item label={t`Issuance reduction rate`}>
        <div className="flex flex-col gap-6">
          <Trans>
            The issuance rate is reduced by this percentage every cycle (every{' '}
            {formatFundingCycleDuration(duration)}). The higher this rate, the
            more incentive to pay this project earlier.
          </Trans>
          <Form.Item
            noStyle
            name="discountRate"
            valuePropName="sliderValue"
            rules={[
              inputMustExistRule({ label: t`An issuance reduction rate` }),
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
                The issuance reduction rate is disabled if you are using
                unlocked cycles (because they have no duration).
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
                  cycle), your project will not issue any tokens unless you edit
                  the issuance rate.
                </Trans>
              ) : (
                <>
                  <p>
                    <Trans>
                      Each cycle, the project will issue {discountRate}% fewer
                      tokens per ETH.{' '}
                    </Trans>
                  </p>
                  <p>
                    <Trans>
                      Next cycle, the project will issue{' '}
                      {formatAmount(secondFundingCycleMintRate)} tokens per 1
                      ETH. The cycle after that, the project will issue{' '}
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

      <Form.Item label={t`Redemption rate`}>
        <div className="flex flex-col gap-6">
          <span>{REDEMPTION_RATE_EXPLANATION}</span>
          <Form.Item
            noStyle
            name="redemptionRate"
            valuePropName="sliderValue"
            rules={[inputMustExistRule({ label: t`A redemption rate` })]}
          >
            <NumberSlider
              min={0}
              defaultValue={0}
              suffix="%"
              step={0.5}
              disabled={redemptionRateDisabled}
            />
          </Form.Item>
          {redemptionRateDisabled ? (
            <Callout.Warning>
              <Trans>
                Redemptions are disabled when all of the project's ETH is being
                used for payouts (when payouts are unlimited).
              </Trans>
            </Callout.Warning>
          ) : (
            !isMobile && (
              <Form.Item noStyle name="redemptionRate">
                <TokenRedemptionRateGraph graphPad={50} graphSize={300} />
              </Form.Item>
            )
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
    </>
  )
}
