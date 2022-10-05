import { t, Trans } from '@lingui/macro'
import { Divider, Form, Space } from 'antd'
import Callout from 'components/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import NumberSlider from 'components/inputs/NumberSlider'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { MAX_MINT_RATE } from 'utils/v2v3/math'
import { inputMustExistRule } from '../../../utils'
import { ReservedTokenRateCallout, ReservedTokensList } from './components'

// TODO: This is here to remind us we need to fix the colors
const TODOCallout: React.FC = ({ children }) => (
  <Callout style={{ backgroundColor: 'magenta' }}>{children}</Callout>
)

export const CustomTokenSettings = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <>
      <Form.Item name="initialMintRate" label={t`Initial Mint Rate`}>
        <FormattedNumberInput
          min={0}
          max={MAX_MINT_RATE}
          accessory={
            <span style={{ color: colors.text.primary, marginRight: 20 }}>
              <Trans>tokens per ETH contributed</Trans>
            </span>
          }
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
        <Trans>
          Allocate reserved tokens to Ethereum addresses or Juicebox projects.
          Unallocated reserved tokens are sent to the project owner.
        </Trans>
        <Form.Item
          noStyle
          name="reservedTokenAllocation"
          rules={[inputMustExistRule({ label: t`Reserved token allocation` })]}
        >
          <ReservedTokensList />
        </Form.Item>
      </Form.Item>

      <Divider />

      {/* TODO: Allow disabling */}
      <Form.Item label={t`Discount rate`}>
        <Trans>
          The project token's issuance rate will decrease by this percentage
          every funding cycle (14 days). A higher discount rate will incentivize
          contributors to pay the project earlier.
        </Trans>
        <Form.Item
          noStyle
          name="discountRate"
          valuePropName="sliderValue"
          rules={[inputMustExistRule({ label: t`Discount Rate` })]}
        >
          <NumberSlider min={0} defaultValue={0} suffix="%" step={0.5} />
        </Form.Item>
        <TODOCallout>
          <Space direction="vertical">
            <Trans>
              Contributors will receive 5% more tokens for contributions they
              make this funding cycle compared to the next funding cycle.
            </Trans>
            <Trans>
              The issuance rate of your second funding cycle will be 950,000
              tokens per 1 ETH, then 902,500 tokens per 1 ETH for your third
              funding cycle, and so on.
            </Trans>
          </Space>
        </TODOCallout>
      </Form.Item>

      <Divider />

      <Form.Item label={t`Redemption rate`}>
        <Trans>
          The redemption rate determines the amount of overflow each token can
          be redeemed for. <a href="#TODO">Learn more.</a>
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
        <TODOCallout>
          <Trans>
            Token minting is not recommended as it allows the project owner to
            create unlimited tokens. This is a risk factor for contributors.
          </Trans>
        </TODOCallout>
      </>
    </>
  )
}
