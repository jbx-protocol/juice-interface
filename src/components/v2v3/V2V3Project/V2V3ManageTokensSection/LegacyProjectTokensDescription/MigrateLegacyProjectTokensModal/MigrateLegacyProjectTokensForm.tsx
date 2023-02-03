import { Trans } from '@lingui/macro'
import { Button, Form, FormInstance, FormProps, Space, Statistic } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { useApproveTokensTx } from 'hooks/JBV3Token/transactor/ApproveTokensTx'
import { useState } from 'react'

interface MigrateLegacyProjectTokensFormType {
  tokenAmount: string
}

export function MigrateLegacyProjectTokensForm({
  legacyTokenBalance,
  form,
  ...props
}: {
  legacyTokenBalance: BigNumber | undefined
  form: FormInstance<MigrateLegacyProjectTokensFormType>
} & FormProps) {
  const [loading, setLoading] = useState<boolean>(false)

  const approveTokensTx = useApproveTokensTx()

  const approveTokens = async (values: MigrateLegacyProjectTokensFormType) => {
    setLoading(true)

    const txSuccess = await approveTokensTx(
      { amountWad: parseWad(values.tokenAmount) },
      {
        onConfirmed() {
          setLoading(false)
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" {...props} onFinish={approveTokens}>
      <Space direction="vertical" size="large" className="w-full">
        <Statistic
          title={<Trans>Your legacy token balance</Trans>}
          value={formatWad(legacyTokenBalance)}
        />

        <Form.Item
          name="tokenAmount"
          required
          label={<Trans>Legacy tokens to migrate</Trans>}
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
            max={parseInt(fromWad(legacyTokenBalance))}
            accessory={
              <InputAccessoryButton
                content={<Trans>MAX</Trans>}
                onClick={() =>
                  form.setFieldsValue({
                    tokenAmount: fromWad(legacyTokenBalance),
                  })
                }
              />
            }
          />
        </Form.Item>
      </Space>
      <Button type="primary" htmlType="submit" loading={loading}>
        Approve migration
      </Button>
    </Form>
  )
}
