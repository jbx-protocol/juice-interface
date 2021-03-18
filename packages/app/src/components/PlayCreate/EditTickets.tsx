import { Button, FormInstance, Space } from 'antd'
import TicketsForm, {
  TicketsFormFields,
} from 'components/shared/forms/TicketsForm'
import React from 'react'

export default function EditTickets({
  form,
  onSave,
  onIssue,
}: {
  form: FormInstance<TicketsFormFields>
  onSave: VoidFunction
  onIssue: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Tickets</h1>

      <div>
        <p>
          Your contract will use these ERC-20 tokens like tickets, handing them
          out to people as a receipt for payments received.
        </p>
        <p>
          Ticket holders can claim a portion of your project's overflow, and can
          vote on proposed changes to your budget.
        </p>
        <p>
          Issuing tickets will deploy your ERC-20 contract, which will cost gas.
          If you don't feel like doing this now, you can do it anytime
          later—your project will automatically use IOU tickets in the meantime,
          so you won't lose any functionality.
        </p>
      </div>

      <TicketsForm form={form} />

      <Space size="middle">
        <Button
          type="primary"
          onClick={() => {
            onSave()
            onIssue()
          }}
        >
          Issue tickets
        </Button>
        <Button onClick={onSave}>Skip for now</Button>
      </Space>
    </Space>
  )
}
