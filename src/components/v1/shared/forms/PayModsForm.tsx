import { t, Trans } from '@lingui/macro'

import { Button, Form, Input, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { BigNumber } from 'ethers'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod } from 'models/v1/mods'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, perbicentToPercent } from 'utils/format/formatNumber'

import { getTotalPercentage } from 'components/formItems/formHelpers'
import ProjectPayoutMods from 'components/v1/shared/ProjectPayMods/ProjectPayoutMods'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'

import { CsvUpload } from 'components/inputs/CsvUpload'
import { constants } from 'ethers'

import { parseV1PayoutModsCsv } from 'utils/csv'

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

  const onModsChanged = (newMods: PayoutMod[]) => {
    setMods(newMods)
    form.setFieldsValue({
      totalPercent: calculateTotalPercentage(newMods),
    })
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div className="text-grey-500 dark:text-grey-300">
        <h1>
          <Trans>Payout recipients</Trans>
        </h1>

        <p>
          <Trans>
            Pay out ETH to Ethereum wallets or Juicebox projects. You can use
            this to pay your contributors, charities, projects you depend on, or
            anyone else.
          </Trans>
        </p>
        <p>
          <Trans>
            By default, all payouts are sent to the project owner's wallet.
          </Trans>
        </p>
      </div>

      <div className="text-right">
        <CsvUpload
          onChange={onModsChanged}
          templateUrl={'/assets/csv/v1-payouts-template.csv'}
          parser={parseV1PayoutModsCsv}
        />
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
            className="mt-5"
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
