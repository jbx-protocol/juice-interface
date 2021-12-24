import { Button, Form, Space, Input } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { useForm } from 'antd/lib/form/Form'
import { CurrencyOption } from 'models/currency-option'
import { PayoutMod } from 'models/mods'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, fromPermyriad } from 'utils/formatNumber'

export default function PayModsForm({
  initialMods,
  currency,
  target,
  fee,
  onSave,
}: {
  initialMods: PayoutMod[]
  currency: CurrencyOption
  target: BigNumber
  fee: BigNumber | undefined
  onSave: (mods: PayoutMod[]) => void
}) {
  // State objects avoid antd form input dependency rerendering issues
  const [mods, setMods] = useState<PayoutMod[]>([])

  const [form] = useForm<{
    totalPercent: number
  }>()

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // Calculates sum of percentages of given payouts
  function calculateTotalPercentage(new_mods: any) {
    return (
      new_mods?.reduce(
        (acc: any, curr: any) =>
          acc + parseFloat(fromPermyriad(curr.percent ?? '0')),
        0,
      ) ?? 0
    )
  }

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [initialMods])

  async function validateAndSaveMods() {
    await form.validateFields()
    onSave(mods)
  }

  // Validates the total distribution percentage
  const validateTotalDistributions = (rule: any, value: any, callback: any) => {
    if (form.getFieldValue('totalPercent') > 100)
      return Promise.reject('Percentages must add up to less than 100%')
    else return Promise.resolve()
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ color: colors.text.secondary }}>
        <h1>Distribution</h1>

        <p>
          Payouts let you commit portions of every withdrawal to other Ethereum
          wallets or Juicebox projects. Use this to pay contributors, charities,
          other projects you depend on, or anyone else. Payouts will be
          distributed automatically whenever a withdrawal is made from your
          project.
        </p>
        <p>
          Payouts are optional. By default, all unallocated revenue will be
          withdrawable to the project owner's wallet.
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name={'totalPercent'}
          rules={[
            {
              validator: validateTotalDistributions,
            },
          ]}
        >
          {/* Added a hidden input here because Form.Item needs 
           a child Input to work. Need the parent Form.Item to 
           validate totalPercent */}
          <Input hidden type="string" autoComplete="off" />
        </Form.Item>
        <FormItems.ProjectPayoutMods
          mods={mods}
          target={fromWad(target)}
          currency={currency}
          onModsChanged={new_mods => {
            setMods(new_mods)
            form.setFieldsValue({
              totalPercent: calculateTotalPercentage(new_mods) ?? 0,
            })
          }}
          fee={fee}
        />
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={validateAndSaveMods}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
