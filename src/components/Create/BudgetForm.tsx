import { Button, Form, Space, Switch, Divider } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useLayoutEffect, useState } from 'react'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  // State objects avoid antd form input dependency rerendering issues
  const [currency, setCurrency] = useState<CurrencyOption>(0)
  const [target, setTarget] = useState<string>('0')
  const [duration, setDuration] = useState<string>('0')
  const [showFundingFields, setShowFundingFields] = useState<boolean>()
  const [showDurationInput, setShowDurationInput] = useState<boolean>()
  const editingFC = useEditingFundingCycleSelector()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setTarget(initialTarget)
    setDuration(initialDuration)
    setShowFundingFields(hasFundingTarget(editingFC))
    setShowDurationInput(BigNumber.from(initialDuration).gt(0))
  }, [])

  const maxIntStr = fromWad(constants.MaxUint256)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding</h1>

      <Form layout="vertical">
        <div style={{ color: colors.text.primary }}>
          <h4>Target</h4>
          <p>
            A funding target allows you to redistribute surplus revenue to your
            community. When a project's balance is greater than its funding
            target, the overflow (surplus funds) can by redeemed by the
            community by burning their project tokens.
          </p>
          <p>
            No more than the target can be distributed from the project in a
            single funding cycle. Whenever a new funding cycle starts, any
            overflow automatically goes towards that cycle's target amount,
            acting as a project's runway.
          </p>
        </div>

        <Form.Item>
          <Space>
            <Switch
              checked={showFundingFields}
              onChange={checked => {
                setTarget(checked ? '10000' : maxIntStr || '0')
                setCurrency(1)
                setShowFundingFields(checked)
              }}
            />
            <label>Set a funding target</label>
          </Space>
        </Form.Item>

        {target == maxIntStr && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>No target:</span> All funds can be
            distributed by the project, and the project will have no overflow.
            (This is the same as setting the target to infinity.)
          </p>
        )}

        {showFundingFields && (
          <FormItems.ProjectTarget
            formItemProps={{
              rules: [{ required: true }],
              extra: null,
            }}
            value={target.toString()}
            onValueChange={val => setTarget(val || '0')}
            currency={currency}
            onCurrencyChange={setCurrency}
            fee={editingFC.fee}
          />
        )}

        {parseInt(target) == 0 && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>Target is 0:</span> No funds can
            be distributed by the project, and the project's entire balance will
            be considered overflow.
          </p>
        )}

        <Divider
          style={{
            margin: '40px 0',
            borderColor: colors.stroke.tertiary,
          }}
        />

        <div>
          <h4>Duration</h4>
          <p style={{ color: colors.text.primary }}>
            The duration of your funding cycle determines how often your target
            amount can be withdrawn (if you've set one), how often your discount
            rates compound, and how often configuration incentives can be
            updated. If a duration isn't set, the project owner can pull money
            out whenever they want up to their target amount, trigger
            retroactive discount rates, and queue and reconfigure the funding
            cycle at any time.
          </p>
        </div>

        <Form.Item>
          <Space>
            <Switch
              checked={showDurationInput}
              onChange={checked => {
                const duration = checked ? '30' : '0'
                setDuration(duration)
                setShowDurationInput(checked)
              }}
            />
            <label>Set a funding cycle duration</label>
          </Space>
        </Form.Item>

        {showDurationInput && (
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
