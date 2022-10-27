import { t, Trans } from '@lingui/macro'
import { Divider, Form, Space } from 'antd'
import { CreateCallout } from 'components/Create/components/CreateCallout'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import ExternalLink from 'components/ExternalLink'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import NumberSlider from 'components/inputs/NumberSlider'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { formatAmount } from 'utils/formatAmount'
import { MAX_MINT_RATE } from 'utils/v2v3/math'
import { inputMustExistRule } from '../../../utils'
import * as ProjectTokenForm from '../../hooks/ProjectTokenForm'
import { ProjectTokensFormProps } from '../../hooks/ProjectTokenForm'
import { ReservedTokenRateCallout, ReservedTokensList } from './components'

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
  const form = Form.useFormInstance<ProjectTokensFormProps>()
  const discountRate =
    Form.useWatch('discountRate', form) ??
    ProjectTokenForm.DefaultSettings.discountRate
  const initialMintRate = parseInt(
    Form.useWatch('initialMintRate', form) ??
      ProjectTokenForm.DefaultSettings.initialMintRate,
  )

  const discountRateDisabled = !parseInt(duration)

  const initalMintRateAccessory = (
    <span style={{ marginRight: 20 }}>
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
        label={t`Initial Mint Rate`}
        extra={isMobile ? initalMintRateAccessory : undefined}
      >
        <FormattedNumberInput
          min={0}
          max={MAX_MINT_RATE}
          accessory={!isMobile ? initalMintRateAccessory : undefined}
        />
      </Form.Item>

      <Divider />

      <Form.Item label={t`Reserved tokens`}>
        <Trans>
          Set aside a percentage of freshly minted tokens, which you can
          allocate below.
        </Trans>
        <Form.Item
          noStyle
          name="reservedTokensPercentage"
          valuePropName="sliderValue"
          rules={[inputMustExistRule({ label: t`Reserved tokens` })]}
        >
          <NumberSlider min={0} defaultValue={0} suffix="%" step={0.5} />
        </Form.Item>
        <ReservedTokenRateCallout />
      </Form.Item>
      <Form.Item label={t`Reserved token allocation`} requiredMark="optional">
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
        >
          <Trans>
            Allocate reserved tokens to Ethereum addresses or Juicebox projects.
            Unallocated reserved tokens are sent to the project owner.
          </Trans>
          <Form.Item
            noStyle
            name="reservedTokenAllocation"
            rules={[
              inputMustExistRule({ label: t`Reserved token allocation` }),
            ]}
          >
            <ReservedTokensList />
          </Form.Item>
        </div>
      </Form.Item>

      <Divider />

      {/* TODO: Allow disabling */}
      <Form.Item label={t`Discount rate`}>
        {!discountRateDisabled && (
          <Trans>
            The project token's issuance rate will decrease by this percentage
            every funding cycle ({formatFundingCycleDuration(duration)}). A
            higher discount rate will incentivize contributors to pay the
            project earlier.
          </Trans>
        )}
        <Form.Item
          noStyle
          name="discountRate"
          valuePropName="sliderValue"
          rules={[inputMustExistRule({ label: t`Discount Rate` })]}
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
          <CreateCallout.Warning>
            <Trans>
              The discount rate cannot be set when the funding cycle duration is
              not set.
            </Trans>
          </CreateCallout.Warning>
        ) : (
          <CreateCallout.Info>
            <Space direction="vertical">
              {discountRate === 0 ? (
                <Trans>
                  Contributors will not receive any extra tokens for paying the
                  project early.
                </Trans>
              ) : discountRate === 100 ? (
                <Trans>
                  Contributors will receive the total amount of tokens available
                  through issuance. All subsequent funding cycles will have a
                  mint rate of 0.
                </Trans>
              ) : (
                <>
                  <Trans>
                    Contributors will receive {discountRate}% more tokens for
                    contributions they make this funding cycle compared to the
                    next funding cycle.
                  </Trans>
                  <Trans>
                    The issuance rate of your second funding cycle will be{' '}
                    {formatAmount(secondFundingCycleMintRate)} tokens per 1 ETH,
                    {formatAmount(thirdFundingCycleMintRate)} tokens per 1 ETH
                    for your third funding cycle, and so on.
                  </Trans>
                </>
              )}
            </Space>
          </CreateCallout.Info>
        )}
      </Form.Item>

      <Divider />

      <Form.Item label={t`Redemption rate`}>
        <Trans>
          The redemption rate determines the amount of overflow each token can
          be redeemed for.{' '}
          <ExternalLink href="https://info.juicebox.money/dev/learn/glossary/redemption-rate">
            Learn more.
          </ExternalLink>
        </Trans>
        <Form.Item
          noStyle
          name="redemptionRate"
          valuePropName="sliderValue"
          rules={[inputMustExistRule({ label: t`Redemption Rate` })]}
        >
          <NumberSlider min={0.1} defaultValue={0} suffix="%" step={0.5} />
        </Form.Item>
        <Form.Item noStyle name="redemptionRate">
          <TokenRedemptionRateGraph graphPad={50} graphSize={300} />
        </Form.Item>
      </Form.Item>

      <Divider />

      <>
        <Form.Item
          extra={t`When enabled, the project owner can manually mint any amount of tokens to any address.`}
          name="tokenMinting"
        >
          <JuiceSwitch label={t`Allow token minting`} />
        </Form.Item>
        <CreateCallout.Warning>
          <Trans>
            Token minting is not recommended as it allows the project owner to
            create unlimited tokens. This is a risk factor for contributors.
          </Trans>
        </CreateCallout.Warning>
      </>
    </>
  )
}
