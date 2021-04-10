import { Button, Col, Form, Input, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { secondsMultiplier } from 'constants/seconds-in-day'
import { colors } from 'constants/styles/colors'
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
          (parseFloat(fields.duration || '0') * secondsMultiplier).toString(),
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
                placeholder="Peach's Juice Stand"
                type="string"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              extra="The money you want to make it happen"
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
            <Form.Item extra="The life cycle of your project" name="duration">
              <FormattedNumberInput
                placeholder="30"
                value={form.getFieldValue('duration')}
                suffix="days"
                accessory={
                  <InputAccessoryButton
                    content={isRecurring ? 'recurring' : 'one-time'}
                    withArrow={true}
                    onClick={() =>
                      dispatch(
                        editingProjectActions.setIsRecurring(!isRecurring),
                      )
                    }
                  />
                }
                onChange={val => form.setFieldsValue({ duration: val })}
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
              Preview your project
            </Button>
          </div>
        </Col>
        <Col xs={24} lg={14}>
          <div
            style={{ fontSize: '1.8rem', lineHeight: 1.3, color: '#ffffffbb' }}
          >
            {bold(editingProject?.name, 'Your project')} needs{' '}
            <CurrencySymbol
              style={{ color: colors.bodyPrimary, fontWeight: 600 }}
              currency={editingBudget?.currency.toString() as BudgetCurrency}
            />
            {bold(formatWad(editingBudget?.target) ?? '0')}{' '}
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
            Users, patrons, and investors get credits when they pay{' '}
            {bold(editingProject?.name, 'your project')}.
            <br />
            <br />
            Credits can be exchanged for overflow.
          </div>
        </Col>
      </Row>
    </div>
  )
}
