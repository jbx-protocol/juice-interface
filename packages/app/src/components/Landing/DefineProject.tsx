import { Button, Col, Form, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FormItems } from 'components/shared/formItems'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleRecurringSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useEffect } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { normalizeHandle } from 'utils/formatHandle'
import { formatWad, fromWad } from 'utils/formatNumber'

type FormFields = {
  name: string
  target: string
  duration: string
  currency: CurrencyOption
}

export default function DefineProject() {
  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)
  const [form] = useForm<FormFields>()
  const editingBudget = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const isRecurring = useEditingFundingCycleRecurringSelector()
  const dispatch = useAppDispatch()

  useEffect(
    () =>
      form.setFieldsValue({
        name: editingProject?.metadata.name ?? '',
        target: fromWad(editingBudget?.target) ?? '0',
        duration: editingBudget?.duration.toString() ?? '0',
        currency: (editingBudget?.currency.toNumber() as CurrencyOption) ?? 0,
      }),
    [],
  )

  const goToReview = () => {
    window.location.hash = 'create'
    window.scrollTo({ top: 0 })
  }

  const onFieldsChange = (fields: Partial<FormFields>) => {
    if (fields.name !== undefined) {
      dispatch(editingProjectActions.setName(fields.name))
      dispatch(editingProjectActions.setHandle(normalizeHandle(fields.name)))
    }
    if (fields.target !== undefined) {
      dispatch(editingProjectActions.setTarget(fields.target))
    }
    if (fields.duration !== undefined) {
      dispatch(
        editingProjectActions.setDuration(
          parseFloat(fields.duration || '0').toString(),
        ),
      )
    }
    if (fields.currency !== undefined) {
      dispatch(editingProjectActions.setCurrency(fields.currency))
    }
  }

  const bold = (text?: string, placeholder?: string) =>
    text ? (
      <span
        style={{
          fontWeight: 600,
          color:
            forThemeOption &&
            forThemeOption({
              [ThemeOption.dark]: '#fff',
              [ThemeOption.light]: '#000',
            }),
        }}
      >
        {text}
      </span>
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
                onFieldsChange({ ...form.getFieldsValue(true), target: val })
              }}
              currency={form.getFieldValue('currency')}
              onCurrencyChange={currency => {
                form.setFieldsValue({ currency })
                onFieldsChange({ ...form.getFieldsValue(true), currency })
              }}
              formItemProps={{
                extra:
                  'The amount of funding your project needs per funding cycle to keep going.',
              }}
              hideLabel
            />
            <FormItems.ProjectDuration
              name="duration"
              value={form.getFieldValue('duration')}
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
            style={{
              fontSize: '1.8rem',
              lineHeight: 1.3,
              color:
                forThemeOption &&
                forThemeOption({
                  [ThemeOption.dark]: '#ffffffbb',
                  [ThemeOption.light]: '#000000dd',
                }),
            }}
          >
            {bold(editingProject?.metadata.name, 'Your project')} needs{' '}
            <CurrencySymbol
              style={{ color: colors.text.primary, fontWeight: 600 }}
              currency={editingBudget?.currency.toNumber() as CurrencyOption}
            />
            {bold(formatWad(editingBudget?.target) ?? '0')}{' '}
            {isRecurring && (
              <span>
                every {bold(editingBudget?.duration.toString(), '0')} days
              </span>
            )}{' '}
            to work. All extra money received is overflow.
            <br />
            <br />
            Users, patrons, and investors get Tickets alongside you when they
            pay {bold(editingProject?.metadata.name, 'your project')}.
            <br />
            <br />
            Tickets can be redeemed for overflow.
          </div>
        </Col>
      </Row>
    </div>
  )
}
