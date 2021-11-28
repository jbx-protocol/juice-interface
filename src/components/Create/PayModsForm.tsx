import { Button, Form, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { PayoutMod } from 'models/mods'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

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

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [initialMods])

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

      <Form layout="vertical">
        <FormItems.ProjectPayoutMods
          mods={mods}
          target={fromWad(target)}
          currency={currency}
          onModsChanged={setMods}
          fee={fee}
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
