import { Trans } from '@lingui/macro'
import { Form, FormInstance, FormProps, Space, Statistic } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { formattedNum } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

interface MigrateV1ProjectTokensFormType {
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

  return (
    <Form form={form} layout="vertical" {...props}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Statistic
          title={<Trans>Your V1 {tokenSymbolFormatted} balance</Trans>}
          value={formattedNum(v1TokenBalance)}
        />

        <Form.Item
          name="tokenAmount"
          rules={[
            {
              message: <Trans>Tokens are required.</Trans>,
              validator: async (_, value) => {
                if (value === '0') throw new Error('Tokens are required')
              },
            },
          ]}
        >
          <FormattedNumberInput
            onChange={val => {
              form.setFieldsValue({ tokenAmount: val })
            }}
            max={v1TokenBalance}
            formItemProps={{
              required: true,
              label: <Trans>V1 tokens to swap</Trans>,
            }}
            accessory={
              <InputAccessoryButton
                content={<Trans>MAX</Trans>}
                onClick={() =>
                  form.setFieldsValue({ tokenAmount: v1TokenBalance })
                }
              />
            }
          />
        </Form.Item>
      </Space>
    </Form>
  )
}
