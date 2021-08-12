import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { TicketMod } from 'models/mods'
import { useLayoutEffect, useState } from 'react'

export type TicketingFormFields = {
  reserved: number
}

export default function TicketingForm({
  form,
  initialMods,
  onSave,
}: {
  form: FormInstance<TicketingFormFields>
  initialMods: TicketMod[]
  onSave: (mods: TicketMod[]) => void
}) {
  const [mods, setMods] = useState<TicketMod[]>([])

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [])

  return (
    <Space direction="vertical" size="large">
      <div>
        <h1>Reserved tokens</h1>

        <p>
          Tokens are earned by anyone who pays your project, and can be redeemed
          for overflow if your project has set a funding target.
        </p>
        <p>
          You'll be able to issue ERC-20 tokens once your project contract has
          been deployed. Until then, your project will use staked tokens,
          allowing your supporters to still track their balance and redeem for
          overflow in the meantime.
        </p>
      </div>

      <Form form={form} layout="vertical">
        <FormItems.ProjectReserved
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) => form.setFieldsValue({ reserved: val })}
        />
        <FormItems.ProjectTicketMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          formItemProps={{
            label: 'Allocate reserved tokens (optional)',
            extra:
              "Automatically distribute a portion of your project's reserved tokens to other Juicebox projects or ETH wallets.",
          }}
        />
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={() => onSave(mods)}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
