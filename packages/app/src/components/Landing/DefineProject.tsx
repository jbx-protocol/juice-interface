import { Button, Col, Form, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectInfoFormFields } from 'components/PlayCreate/ProjectInfo'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FormItems } from 'components/shared/formItems'
import { SECONDS_MULTIPLIER } from 'constants/units'
import { colors } from 'constants/styles/colors'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleRecurringSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useEffect } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { formatWad, fromWad } from 'utils/formatCurrency'

type FormFields = ProjectInfoFormFields

export default function DefineProject() {
  const [form] = useForm<FormFields>()
  const editingBudget = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const isRecurring = useEditingFundingCycleRecurringSelector()
  const dispatch = useAppDispatch()

  useEffect(
    () =>
      form.setFieldsValue({
        name: editingProject?.name ?? '',
        target: fromWad(editingBudget?.target) ?? '0',
        duration:
          (editingBudget?.duration / SECONDS_MULTIPLIER).toString() ?? '0',
        currency: (editingBudget?.currency.toString() ?? '0') as CurrencyOption,
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
          (parseFloat(fields.duration || '0') * SECONDS_MULTIPLIER).toString(),
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
            <FormItems.ProjectName name="name" hideLabel />
            <FormItems.ProjectTarget
              name="target"
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
              hideLabel
            />
            <FormItems.ProjectDuration
              name="duration"
              value={form.getFieldValue('duration')}
              onChange={val => form.setFieldsValue({ duration: val })}
              isRecurring={isRecurring}
              onToggleRecurring={() =>
                dispatch(editingProjectActions.setIsRecurring(!isRecurring))
              }
              hideLabel
            />
            <Form.Item
              style={{
                textAlign: 'right',
              }}
            >
              <Button type="primary" htmlType="submit" onClick={goToReview}>
                Preview your project
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} lg={14}>
          <div
            style={{ fontSize: '1.8rem', lineHeight: 1.3, color: '#ffffffbb' }}
          >
            {bold(editingProject?.name, 'Your project')} needs{' '}
            <CurrencySymbol
              style={{ color: colors.bodyPrimary, fontWeight: 600 }}
              currency={editingBudget?.currency.toString() as CurrencyOption}
            />
            {bold(formatWad(editingBudget?.target) ?? '0')}{' '}
            {isRecurring ? (
              <span>
                every{' '}
                {bold(
                  (editingBudget?.duration / SECONDS_MULTIPLIER).toString(),
                  '0',
                )}{' '}
                days
              </span>
            ) : null}{' '}
            to work. All extra money received is overflow.
            <br />
            <br />
            Users, patrons, and investors get Tickets when they pay{' '}
            {bold(editingProject?.name, 'your project')}.
            <br />
            <br />
            Tickets can be exchanged for overflow.
          </div>
        </Col>
      </Row>
    </div>
  )
}
