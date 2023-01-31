import { Trans } from '@lingui/macro'
import { Form, FormInstance, FormProps, Space, Statistic } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { formattedNum } from 'utils/format/formatNumber'

interface MigrateLegacyProjectTokensFormType {
  tokenAmount: string
}

export function MigrateLegacyProjectTokensForm({
  legacyTokenBalance,
  form,
  ...props
}: {
  legacyTokenBalance: number | undefined
  form: FormInstance<MigrateLegacyProjectTokensFormType>
} & FormProps) {
  return (
    <Form form={form} layout="vertical" {...props}>
      <Space direction="vertical" size="large" className="w-full">
        <Statistic
          title={<Trans>Your total legacy balance</Trans>}
          value={formattedNum(legacyTokenBalance)}
        />

        <Form.Item
          name="tokenAmount"
          required
          label={<Trans>V1 tokens to swap</Trans>}
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
            max={legacyTokenBalance}
            accessory={
              <InputAccessoryButton
                content={<Trans>MAX</Trans>}
                onClick={() =>
                  form.setFieldsValue({ tokenAmount: legacyTokenBalance })
                }
              />
            }
          />
        </Form.Item>
      </Space>
    </Form>
  )
}
