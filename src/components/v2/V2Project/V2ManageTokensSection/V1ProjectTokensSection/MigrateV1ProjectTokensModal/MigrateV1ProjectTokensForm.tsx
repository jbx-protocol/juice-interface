import { Trans } from '@lingui/macro'
import { Form, FormInstance, FormProps, Input, Space, Statistic } from 'antd'
import { formattedNum } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export interface MigrateV1ProjectTokensFormType {
  tokenAmount: string
}

export function MigrateV1ProjectTokensForm({
  v1TokenSymbol,
  v1TokenBalance,
  form,
  ...props
}: {
  v1TokenSymbol?: string
  v1TokenBalance: number
  form: FormInstance<MigrateV1ProjectTokensFormType>
} & FormProps) {
  const tokenSymbolFormatted = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
  })
  const tokenSymbolFormattedPlural = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
    plural: v1TokenBalance !== 1,
  })

  return (
    <Form form={form} layout="vertical" {...props}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Statistic
          title={<Trans>Your V1 {tokenSymbolFormatted} balance</Trans>}
          value={formattedNum(v1TokenBalance)}
        />

        <Form.Item
          name="tokenAmount"
          label={<Trans>Tokens to migrate</Trans>}
          rules={[
            {
              required: true,
              message: <Trans>Tokens are required.</Trans>,
            },
          ]}
        >
          <Input
            suffix={`V1 ${tokenSymbolFormattedPlural}`}
            max={v1TokenBalance}
          />
        </Form.Item>
      </Space>
    </Form>
  )
}
