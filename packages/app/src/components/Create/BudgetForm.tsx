import { Button, Form, FormInstance, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useLayoutEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad } from 'utils/formatNumber'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'

export default function BudgetForm({
  initialCurrency,
  initialTarget,
  initialDuration,
  onSave,
}: {
  initialCurrency: CurrencyOption
  initialTarget: string
  initialDuration: string
  onSave: (currency: CurrencyOption, target: string, duration: string) => void
}) {
  // State objects avoid antd form input dependency rerendering issues
  const [currency, setCurrency] = useState<CurrencyOption>(0)
  const [target, setTarget] = useState<string>('0')
  const [duration, setDuration] = useState<string>('0')
  const [showFundingFields, setShowFundingFields] = useState<boolean>()
  const editingFC = useEditingFundingCycleSelector()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setTarget(initialTarget)
    setDuration(initialDuration)
    setShowFundingFields(hasFundingTarget(editingFC))
  }, [])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding</h1>

      <p>
        Setting a funding target allows you to redistribute surplus revenue to
        your community. Whenever your project earns more than your funding
        target in a set duration, the extra funds are locked in an overflow pool. Anyone who holds your tokens can exchange
        them for a portion of funds from the overflow pool.
      </p>

      <Form layout="vertical">
        <Form.Item>
          <Space>
            <Switch
              checked={showFundingFields}
              onChange={checked => {
                setTarget(
                  checked ? '10000' : fromWad(constants.MaxUint256) || '0',
                )
                setCurrency(1)
                setDuration(checked ? '30' : '0')
                dispatch(editingProjectActions.setIsRecurring(checked))
                setShowFundingFields(checked)
              }}
            />
            <label>Set a funding target</label>
          </Space>
        </Form.Item>
        {showFundingFields && (
          <FormItems.ProjectDuration
            value={duration}
            isRecurring={isRecurring(editingFC)}
            onToggleRecurring={() =>
              dispatch(
                editingProjectActions.setIsRecurring(!isRecurring(editingFC)),
              )
            }
            onValueChange={val => setDuration(val ?? '0')}
            formItemProps={{
              rules: [{ required: true }],
            }}
          />
        )}
        {showFundingFields && (
          <FormItems.ProjectTarget
            formItemProps={{
              rules: [{ required: true }],
            }}
            value={target.toString()}
            onValueChange={val => setTarget(val || '0')}
            currency={currency}
            onCurrencyChange={setCurrency}
            includeFee
          />
        )}
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(currency, target, duration)}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
