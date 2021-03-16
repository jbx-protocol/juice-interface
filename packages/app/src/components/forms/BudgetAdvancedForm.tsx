import { Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import { useState } from 'react'

export type BudgetAdvancedFormFields = {
  link: string
  discountRate: string
  donationRecipient: string
  donationAmount: string
  reserved: string
}

export default function BudgetAdvancedForm({
  form,
}: {
  form: FormInstance<BudgetAdvancedFormFields>
}) {
  const [donationRecipientRequired, setBeneficiaryAddressRequired] = useState<
    boolean
  >(false)

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        extra="If you want, a link to your mission statement and your budgeting specs."
        name="link"
        label="Link"
      >
        <Input
          placeholder="https://docs.google.com/my-budget-info"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        extra="For every ticket given to someone who pays you, this percentage of tickets will be reserved for yourself."
        name="reserved"
        label="Reserved tickets"
        initialValue={5}
      >
        <Input
          className="align-end"
          suffix="%"
          type="number"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item extra="" name="donation" label="Donate" initialValue={0}>
        <Input
          className="align-end"
          suffix="%"
          type="number"
          onChange={e =>
            setBeneficiaryAddressRequired(parseFloat(e.target.value) > 0)
          }
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        extra="An address that you wish to give a percentage of your overflow to."
        name="donationRecipient"
        label="Donation address"
        rules={[{ required: donationRecipientRequired }]}
      >
        <Input placeholder="0x01a2b3c..." autoComplete="off" />
      </Form.Item>
      <Form.Item
        extra="The rate (95%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
        name="discountRate"
        label="Discount rate"
        rules={[{ required: true }]}
        initialValue={97}
      >
        <Input
          className="align-end"
          suffix="%"
          type="number"
          min={95}
          max={100}
          placeholder="97"
          autoComplete="off"
        />
      </Form.Item>
    </Form>
  )
}
