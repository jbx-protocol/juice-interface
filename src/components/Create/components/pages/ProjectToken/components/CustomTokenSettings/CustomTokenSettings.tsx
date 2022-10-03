import { t, Trans } from '@lingui/macro'
import { Divider, Form, Input, Space, Switch } from 'antd'
import Callout from 'components/Callout'
import NumberSlider from 'components/inputs/NumberSlider'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph'

export const CustomTokenSettings = () => {
  return (
    <>
      <Form.Item name="initialMintRate" label={t`Initial Mint Rate`}>
        <Input suffix={t`tokens per ETH contributed`} />
      </Form.Item>

      <Divider />

      <Form.Item label={t`Reserved tokens`}>
        <Trans>
          Set aside a percentage of freshly minted tokens, which you can
          allocate below.
        </Trans>
        <Form.Item noStyle name="reservedTokens">
          <NumberSlider />
        </Form.Item>
        {/* START: This is not final - just a placeholder */}
        <Callout>
          Contributor rate: 630,000 tokens / 1 ETH
          <br />
          Reserved rate: 370,000 tokens / 1 ETH
        </Callout>
        {/* END: This is not final - just a placeholder */}
      </Form.Item>
      <Form.Item label={t`Reserved token allocation`} requiredMark="optional">
        <Trans>
          Allocate reserved tokens to Ethereum addresses or Juicebox projects.
          Unallocated reserved tokens are sent to the project owner.
        </Trans>
        <Form.Item noStyle name="reservedTokenAllocation">
          {/* TODO allocation */}
        </Form.Item>
      </Form.Item>

      <Divider />

      <Form.Item label={t`Discount rate`}>
        <Trans>
          The project token's issuance rate will decrease by this percentage
          every funding cycle (14 days). A higher discount rate will incentivize
          contributors to pay the project earlier.
        </Trans>
        <Form.Item noStyle name="discountRate">
          <NumberSlider />
        </Form.Item>
        <Callout>
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
        </Callout>
      </Form.Item>

      <Divider />

      <Form.Item label={t`Redemption rate`}>
        <Trans>
          The redemption rate determines the amount of overflow each token can
          be redeemed for. <a href="#TODO">Learn more.</a>
        </Trans>
        <Form.Item noStyle name="redemptionRate">
          <NumberSlider />
        </Form.Item>
        <Form.Item noStyle name="redemptionRate">
          <TokenRedemptionRateGraph graphPad={50} graphSize={300} />
        </Form.Item>
      </Form.Item>

      <Divider />

      <>
        <Form.Item
          extra={t`When enabled, the project owner can manually mint any amount of tokens to any address.`}
        >
          <Space>
            <Form.Item name="tokenMinting" valuePropName="checked">
              <Switch />
            </Form.Item>
            <h3>Allow token minting</h3>
          </Space>
        </Form.Item>
        <Callout>
          <Trans>
            Token minting is not recommended as it allows the project owner to
            create unlimited tokens. This is a risk factor for contributors.
          </Trans>
        </Callout>
      </>
    </>
  )
}
