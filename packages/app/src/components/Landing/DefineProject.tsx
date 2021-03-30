import { Button, Checkbox, Col, Form, Input, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { secondsMultiplier } from 'constants/seconds-in-day'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingBudgetRecurringSelector,
  useEditingBudgetSelector,
} from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { useEffect } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { budgetCurrencySymbol } from 'utils/budgetCurrency'
import { formatWad, fromWad } from 'utils/formatCurrency'

type FormFields = ProjectInfoFormFields

export default function DefineProject() {
  const [form] = useForm<FormFields>()
  const editingBudget = useEditingBudgetSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const isRecurring = useEditingBudgetRecurringSelector()
  const dispatch = useAppDispatch()

  useEffect(
    () =>
      form.setFieldsValue({
        name: editingProject?.name ?? '',
        target: fromWad(editingBudget?.target) ?? '0',
        duration:
          editingBudget?.duration.div(secondsMultiplier).toString() ?? '0',
        currency: (editingBudget?.currency.toString() ?? '0') as BudgetCurrency,
      }),
    [],
  )

  const goToReview = () => (window.location.hash = 'create')

  const onFieldsChange = (fields: Partial<FormFields>) => {
    if (fields.name !== undefined)
      dispatch(editingProjectActions.setName(fields.name))
    if (fields.target !== undefined)
      dispatch(editingProjectActions.setTarget(fields.target))
    if (fields.duration !== undefined)
      dispatch(
        editingProjectActions.setDuration(
          (parseFloat(fields.duration) * secondsMultiplier).toString(),
        ),
      )
    if (fields.currency !== undefined)
      dispatch(editingProjectActions.setCurrency(fields.currency))
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
                  form.setFieldsValue({ currency })
                  if (onFieldsChange) onFieldsChange({ currency })
                }}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex' }}>
                <Checkbox
                  defaultChecked={isRecurring}
                  onChange={e => {
                    dispatch(
                      editingProjectActions.setIsRecurring(e.target.checked),
                    )
                  }}
                ></Checkbox>
                <div style={{ marginLeft: 10 }}>
                  Use a recurring funding target
                </div>
              </div>
            </Form.Item>
            {isRecurring ? (
              <Form.Item
                extra="The time period of this recurring budget"
                name="duration"
              >
                <FormattedNumberInput
                  placeholder="30"
                  value={form.getFieldValue('duration')}
                  suffix="days"
                  onChange={val => form.setFieldsValue({ duration: val })}
                />
              </Form.Item>
            ) : null}
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
            {bold(editingProject?.name, 'Your project')} needs{' '}
            {bold(
              budgetCurrencySymbol(editingBudget?.currency.toString()) +
                (formatWad(editingBudget?.target) ?? '0'),
            )}{' '}
            {isRecurring ? (
              <span>
                every{' '}
                {bold(
                  editingBudget?.duration.div(secondsMultiplier).toString(),
                  '0',
                )}{' '}
                days
              </span>
            ) : null}{' '}
            to work. All extra money received is overflow.
            <br />
            <br />
            Users, patrons, and investors get tickets alongside you when they
            pay for {bold(editingProject?.name, 'your project')}.
            <br />
            <br />
            All overflow is redistributed back to ticket holders.
          </div>
        </Col>
      </Row>
    </div>
  )
}
