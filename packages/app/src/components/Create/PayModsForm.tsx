import { Button, Form, FormInstance, Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FormItems } from 'components/shared/formItems'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/mods'
import { useLayoutEffect, useState } from 'react'
import {
  formattedNum,
  formatWad,
  fromPerbicent,
  mulPercent,
  parsePerbicent,
} from 'utils/formatNumber'
import { BigNumber, constants } from 'ethers'

export default function PayModsForm({
  initialMods,
  currency,
  target,
  onSave,
}: {
  initialMods: ModRef[]
  currency: CurrencyOption
  target: BigNumber
  onSave: (mods: ModRef[]) => void
}) {
  // State objects avoid antd form input dependency rerendering issues
  const [mods, setMods] = useState<ModRef[]>([])

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <h1>Spending</h1>

        <p>
          Payouts let you commit portions of every withdrawal to other Ethereum
          wallets or Juiceboxes. Use this to pay contributors, charities, other
          Juiceboxes you depend on, or anyone else. Payouts will be distributed
          automatically whenever a withdrawal is made from your Juicebox.
        </p>
        <p>
          Payouts are optional. By default, all unallocated revenue will be
          withdrawable to the Juicebox owner's wallet.
        </p>
      </div>

      <Form layout="vertical">
        <FormItems.ProjectMods
          name="mods"
          mods={mods}
          onModsChanged={setMods}
          addButtonText="Add a payout"
          formatPercent={
            target.lt(constants.MaxUint256)
              ? percent => (
                  <span>
                    {currency !== undefined ? (
                      <CurrencySymbol currency={currency} />
                    ) : null}
                    {formatWad(mulPercent(target, percent.toString()))}
                  </span>
                )
              : undefined
          }
        />
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(mods)}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
