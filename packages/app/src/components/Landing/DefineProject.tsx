import { Button, Col, Form, Input, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import BudgetTargetInput from 'components/shared/BudgetTargetInput'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { UserContext } from 'contexts/userContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingBudgetSelector,
  useUserBudgetSelector,
} from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useEffect, useMemo } from 'react'
import { editingBudgetActions } from 'redux/slices/editingBudget'
import { editingTicketsActions } from 'redux/slices/editingTickets'
import { budgetCurrencySymbol } from 'utils/budgetCurrency'
import { formatWad, fromWad } from 'utils/formatCurrency'

type FormFields = ProjectInfoFormFields & { ticketsSymbol: string }

export default function DefineProject() {
  const { userAddress } = useContext(UserContext)
  const [form] = useForm<FormFields>()
  const userBudget = useUserBudgetSelector()
  const editingTickets = useAppSelector(state => state.editingTickets)
  const editingBudget = useEditingBudgetSelector()
  const dispatch = useAppDispatch()

  console.log({ userBudget, editingBudget })

  const budget = useMemo(() => userBudget ?? editingBudget, [
    userBudget,
    editingBudget,
  ])

  useEffect(
    () =>
      form.setFieldsValue({
        name: budget?.name ?? '',
        target: fromWad(budget?.target) ?? '0',
        duration:
          budget?.duration
            .div(process.env.NODE_ENV === 'production' ? SECONDS_IN_DAY : 1)
            .toString() ?? '0',
        currency: (budget?.currency.toString() ?? '0') as BudgetCurrency,
      }),
    [budget, form],
  )

  const goToReview = () => {
    if (userBudget && userAddress) {
      window.location.hash = userAddress
      return
    }

    if (userAddress) dispatch(editingBudgetActions.setProject(userAddress))

    window.location.hash = 'create'
  }

  const onFieldsChange = (fields: Partial<FormFields>) => {
    if (fields.name !== undefined)
      dispatch(editingBudgetActions.setName(fields.name))
    if (fields.target !== undefined)
      dispatch(editingBudgetActions.setTarget(fields.target))
    if (fields.duration !== undefined)
      dispatch(editingBudgetActions.setDuration(fields.duration))
    if (fields.currency !== undefined)
      dispatch(editingBudgetActions.setCurrency(fields.currency))
    if (fields.ticketsSymbol !== undefined)
      dispatch(editingTicketsActions.setSymbol(fields.ticketsSymbol))
  }

  const bold = (text?: string, placeholder?: string) =>
    text ? (
      <span style={{ fontWeight: 600, color: '#fff' }}>{text}</span>
    ) : (
      <span style={{ fontWeight: 600 }}>{placeholder}</span>
    )

  return (
    <div>
      <Row gutter={60}>
        <Col xs={24} lg={10}>
          <Form form={form} layout="vertical" onValuesChange={onFieldsChange}>
            <Form.Item extra="The name of your project on-chain" name="name">
              <Input
                className="align-end"
                placeholder="Peach's Juice Stand"
                type="string"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              extra="The amount of money you want to make it happen"
              name="target"
            >
              <BudgetTargetInput
                value={form.getFieldValue('target')}
                onValueChange={val => {
                  form.setFieldsValue({ target: val })
                  if (onFieldsChange) onFieldsChange({ target: val })
                }}
                currency={form.getFieldValue('currency')}
                onCurrencyChange={currency => {
                  const val = {
                    currency: currency === '1' ? '0' : ('1' as BudgetCurrency),
                  }
                  form.setFieldsValue(val)
                  if (onFieldsChange) onFieldsChange(val)
                }}
              />
            </Form.Item>
            <Form.Item
              extra="The recurring time frame of this budget"
              name="duration"
            >
              <Input
                placeholder="30"
                type="number"
                suffix="days"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              extra="The symbol for your project's ERC-20 tickets"
              name="ticketsSymbol"
            >
              <Input
                onChange={e => {
                  const val = {
                    ticketsSymbol: e.target.value.toUpperCase(),
                  }
                  form.setFieldsValue(val)
                  onFieldsChange(val)
                }}
                placeholder="PEACH"
                type="string"
                autoComplete="off"
              />
            </Form.Item>
          </Form>

          <div
            style={{
              textAlign: 'right',
              paddingTop: 20,
            }}
          >
            <Button type="primary" onClick={goToReview}>
              See your project
            </Button>
          </div>
        </Col>
        <Col xs={24} lg={14}>
          <div
            style={{ fontSize: '1.8rem', lineHeight: 1.3, color: '#ffffffbb' }}
          >
            {bold(editingBudget?.name, 'Your project')} needs{' '}
            {bold(
              budgetCurrencySymbol(editingBudget?.currency.toString()) +
                (formatWad(editingBudget?.target) ?? '0'),
            )}{' '}
            every {bold(editingBudget?.duration.toString(), '0')} days to work.
            All extra money received is overflow.
            <br />
            <br />
            Overflow can be claimed by {bold(
              editingTickets.symbol,
              'ticket',
            )}{' '}
            holders.
            <br />
            <br />
            Users, patrons, and investors get {bold(editingTickets.symbol, 'tickets')} by contributing to {' '}
            {bold(editingBudget?.name, 'your project')}.
          </div>
        </Col>
      </Row>
    </div>
  )
}
