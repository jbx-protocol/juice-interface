import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { AddLinkFormFields } from 'components/PlayCreate/AddLink'
import { AdvancedSettingsFormFields } from 'components/PlayCreate/AdvancedSettings'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import { emptyAddress } from 'constants/empty-address'
import { UserContext } from 'contexts/userContext'
import { useUserBudgetSelector } from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useEffect, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import {
  fromPerMille,
  fromWad,
  parsePerMille,
  parseWad,
} from 'utils/formatCurrency'

export type ReconfigureFormFields = ProjectInfoFormFields &
  AdvancedSettingsFormFields &
  AddLinkFormFields

export default function ReconfigureBudgetModal({
  visible,
  onDone,
}: {
  visible?: boolean
  onDone?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const userBudget = useUserBudgetSelector()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<ReconfigureFormFields>()
  const [donationRecipientRequired, setBeneficiaryAddressRequired] = useState<
    boolean
  >(false)

  useEffect(() => {
    if (!userBudget) return

    form.setFieldsValue({
      name: userBudget.name,
      duration: userBudget.duration.toString(),
      target: fromWad(userBudget.target),
      currency: userBudget.currency.toString() as BudgetCurrency,
      link: userBudget.link,
      discountRate: fromPerMille(userBudget.discountRate),
      donationRecipient: addressExists(userBudget.donationRecipient)
        ? userBudget.donationRecipient
        : '',
      donationAmount: fromPerMille(userBudget.donationAmount),
      reserved: fromPerMille(userBudget.reserved),
    })
  }, [])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const valid = await form.validateFields()

    if (!valid) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(
      contracts.BudgetStore,
      'configure',
      [
        parseWad(fields.target)?.toHexString(),
        BigNumber.from(fields.currency).toHexString(),
        BigNumber.from(fields.duration).toHexString(),
        fields.name,
        fields.link,
        parsePerMille(fields.discountRate).toHexString(),
        parsePerMille(fields.reserved).toHexString(),
        addressExists(fields.donationRecipient)
          ? fields.donationRecipient
          : emptyAddress,
        parsePerMille(fields.donationAmount).toHexString(),
      ],
      {
        onDone: () => {
          setLoading(false)
          if (onDone) onDone()
        },
      },
    )
  }

  return (
    <Modal
      title="Reconfigure budget"
      visible={visible}
      okText="Save changes"
      onOk={saveBudget}
      onCancel={onDone}
      confirmLoading={loading}
      width={800}
    >
      <Form form={form}>
        <Form.Item
          extra="How your project is identified on-chain"
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input
            className="align-end"
            placeholder="Peach's Juice Stand"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          extra="The amount of money you want/need in order to absolutely crush your mission statement."
          name="target"
          label="Operating cost"
          rules={[{ required: true }]}
        >
          <BudgetTargetInput
            value={form.getFieldValue('target')}
            onValueChange={val => form.setFieldsValue({ target: val })}
            currency={form.getFieldValue('currency')}
            onCurrencyChange={currency =>
              form.setFieldsValue({ currency: currency === '1' ? '0' : '1' })
            }
          />
        </Form.Item>
        <Form.Item
          extra="The duration of this budgeting scope."
          name="duration"
          label="Time frame"
          rules={[{ required: true }]}
        >
          <Input
            className="align-end"
            placeholder="30"
            type="number"
            suffix="days"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          // extra="For every ticket given to someone who pays you, this percentage of tickets will be reserved for yourself."
          extra="The percentage of your project's overflow that you'd like to reserve for yourself."
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
        <Form.Item
          extra="An address that you wish to give a percentage of your overflow to."
          name="donationRecipient"
          label="Donation address"
          rules={[{ required: donationRecipientRequired }]}
        >
          <Input placeholder="0x01a2b3c..." autoComplete="off" />
        </Form.Item>
        <Form.Item
          extra=""
          name="donation"
          label="Donation amount"
          initialValue={0}
        >
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
    </Modal>
  )
}
