import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ModRef } from 'models/mods'
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
  initialMods: ModRef[]
  onSave: (mods: ModRef[]) => void
}) {
  const [mods, setMods] = useState<ModRef[]>([])

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [])

  return (
    <Space direction="vertical" size="large">
      <div>
        <h1>Reserved tokens</h1>

        <p>
          Tokens are earned by anyone who makes a payment to your Juicebox, and
          can be redeemed for overflow if your Juicebox has set a funding
          target.
        </p>
        <p>
          You'll be able to issue ERC-20 tokens once your Juicebox contract has
          been deployed. Until then, your Juicebox will use staked tokens, so
          your supporters can still track their balance and redeem for overflow
          in the meantime.
        </p>
      </div>

      <Form form={form} layout="vertical">
        <FormItems.ProjectReserved
          name="reserved"
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) => form.setFieldsValue({ reserved: val })}
        />
        <FormItems.ProjectMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          addButtonText="Add a token receiver"
          formItemProps={{
            label: 'Allocate reserved tokens (optional)',
            extra:
              "Automatically distribute a portion of your Juicebox's reserved tokens to other Juiceboxes or ETH wallets. Reserved tokens will be distributed as soon as they're minted.",
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
