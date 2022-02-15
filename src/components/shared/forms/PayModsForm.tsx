import { t, Trans } from '@lingui/macro'

import { Button, Form, Space, Input } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { useForm } from 'antd/lib/form/Form'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod } from 'models/mods'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

import { getTotalPercentage } from 'components/shared/formItems/formHelpers'

export default function PayModsForm({
  initialMods,
  currency,
  target,
  fee,
  onSave,
}: {
  initialMods: PayoutMod[]
  currency: V1CurrencyOption
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
  function calculateTotalPercentage(newMods: PayoutMod[] | undefined) {
    return getTotalPercentage(newMods)
  }

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [initialMods])

  async function validateAndSaveMods() {
    await form.validateFields()
    onSave(mods)
  }

  // Validates the total distribution percentage
  const validateTotalDistributions = () => {
    if (form.getFieldValue('totalPercent') > 100)
      return Promise.reject(t`Sum of percentages cannot exceed 100%.`)
    return Promise.resolve()
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ color: colors.text.secondary }}>
        <h1>
          <Trans>Funding distribution</Trans>
        </h1>

        <p>
          <Trans>
            Distribute available funds to other Ethereum wallets or Juicebox
            projects as payouts. Use this to pay contributors, charities,
            Juicebox projects you depend on, or anyone else. Funds are
            distributed whenever a withdrawal is made from your project.
          </Trans>
        </p>
        <p>
          <Trans>
            By default, all unallocated funds can be distributed to the project
            owner's wallet.
          </Trans>
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
              totalPercent: calculateTotalPercentage(new_mods),
            })
          }}
          fee={fee}
          formItemProps={{
            label: t`Payouts (optional)`,
          }}
        />
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={validateAndSaveMods}
          >
            <Trans>Save payouts</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
