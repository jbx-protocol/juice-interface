import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button, Form, FormInstance, FormProps, Space, Statistic } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useERC20Allowance from 'hooks/ERC20/ERC20Allowance'
import { useApproveTokensTx } from 'hooks/JBV3Token/transactor/ApproveTokensTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'

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
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { userAddress } = useWallet()

  const [loading, setLoading] = useState<boolean>(false)

  const approveTokensTx = useApproveTokensTx()
  const { data: allowance } = useERC20Allowance(
    tokenAddress,
    userAddress,
    userAddress,
  )

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
    <Form
      form={form}
      layout="vertical"
      {...props}
      onFinish={approveTokens}
      className={props.disabled ? 'pointer-events-none opacity-50' : undefined}
    >
      <Space direction="vertical" size="large" className="w-full">
        <Statistic
          title={<Trans>Your total legacy tokens</Trans>}
          value={formatWad(legacyTokenBalance)}
        />

        <Statistic
          title={<Trans>Your migration allowance</Trans>}
          value={formatWad(allowance)}
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
      <Button type="primary" size="small" htmlType="submit" loading={loading}>
        <Trans>Approve migration</Trans>
      </Button>
    </Form>
  )
}
