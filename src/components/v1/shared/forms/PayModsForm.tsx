import { t, Trans } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, Input, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ThemeContext } from 'contexts/themeContext'
import { PayoutMod } from 'models/mods'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, perbicentToPercent } from 'utils/format/formatNumber'

import { getTotalPercentage } from 'components/formItems/formHelpers'
import ProjectPayoutMods from 'components/v1/shared/ProjectPayMods/ProjectPayoutMods'
import { CurrencyContext } from 'contexts/currencyContext'

import * as constants from '@ethersproject/constants'

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

  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

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
        <ProjectPayoutMods
          mods={mods}
          target={fromWad(target)}
          currencyName={currency === ETH ? 'ETH' : 'USD'}
          onModsChanged={new_mods => {
            setMods(new_mods)
            form.setFieldsValue({
              totalPercent: calculateTotalPercentage(new_mods),
            })
          }}
          feePercentage={perbicentToPercent(fee)}
          formItemProps={{
            label: t`Payouts (optional)`,
          }}
          targetIsInfinite={!target || target.eq(constants.MaxUint256)}
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
