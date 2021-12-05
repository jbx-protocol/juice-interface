import { Button, Divider, Form, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
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
  const editingFC = useEditingFundingCycleSelector()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()
  const { adminFeePercent } = useContext(UserContext)

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setTarget(initialTarget)
    setDuration(initialDuration)
    setShowFundingFields(hasFundingTarget(editingFC))
  }, [editingFC, initialCurrency, initialDuration, initialTarget])

  const maxIntStr = fromWad(constants.MaxUint256)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Setup Your Funding Cycle</h1>

      <Form layout="vertical">
        <div style={{ color: colors.text.secondary }}>
          <h4>Funding Cycle</h4>
          <p>
            A funding cycle is how your project will manage its funds. A funding
            cycle consists of a goal and its duration. Your project's funding
            cycle is dependent on the kind of project you're starting.
          </p>
          <p>
            For example: If you are trying to raise an unlimited amount of
            funding, you will not need to set a funding goal or a duration. This
            allows you to raise as much as you want for as long as you want.
          </p>
          <p>
            If you are raising funding for a project that has expenses like
            operating costs, payroll, and/or business expenses, you can think of
            your funding cycle as a weekly or bi-weekly pay period.
          </p>
          <p></p>
          <h4>Funding Goal</h4>
          <p>
            Your funding goal is your project's expenses, publicly stated. You
            cannot distribute more than the amount you set as your funding goal
            in a given cycle. If your project has surpassed its funding goal,
            overflow is created.
          </p>
          <p>
            Overflow (a surplus in funds) automatically goes toward your next
            funding cycle, if you create one. Otherwise, overflow can be
            redeemed by community token holders.
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
            <label>Set a funding goal</label>
          </Space>
        </Form.Item>

        {target === maxIntStr && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>If your goal is 0:</span> The
            entire project's funds can be distributed. There will be no
            overflow. This is the same as setting the goal to infinity.
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
            fee={adminFeePercent}
          />
        )}

        {showFundingFields && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>If target is 0:</span> The entire
            project's funds can be distributed. There will be no overflow. This
            is the same as setting the goal to infinity.
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
          <p style={{ color: colors.text.secondary }}>
            The duration determines how long your funding cycle will last. No
            more than the funding goal (if a goal has been set) can be
            distributed by the project in a single funding cycle. Any changes
            made to your funding cycle won't take effect until the start of the
            next funding cycle.
          </p>
        </div>

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

        {duration === '0' && (
          <p style={{ color: colors.text.primary, marginTop: 20 }}>
            <span style={{ fontWeight: 600 }}>Duration not set:</span> Changes
            can be made to your funding cycle at any time. Making changes will
            start a new funding cycle.
          </p>
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
