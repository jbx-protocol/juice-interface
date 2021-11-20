import { Button, Divider, Form, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { NetworkContext } from 'contexts/networkContext'
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
  }, [])

  const maxIntStr = fromWad(constants.MaxUint256)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding</h1>

      <Form layout="vertical">
        <div style={{ color: colors.text.secondary }}>
          <h4>Target</h4>
          <p>
            No more than the target can be distributed from the project in a
            single funding cycle. Whenever a new funding cycle starts, any
            overflow automatically goes towards that cycle's target amount,
            acting as a project's runway.
          </p>
          <p>
            A funding target allows you to redistribute surplus revenue to your
            community. When a project's balance is greater than its funding
            target, the overflow (surplus funds) can by redeemed by the
            community by burning their project tokens.
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

        {target === maxIntStr && (
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
            fee={adminFeePercent}
          />
        )}

        {showFundingFields && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>If target is 0:</span> No funds
            can be distributed by the project, and the project's entire balance
            will be considered overflow.
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
            This duration determines how long your funding cycles will last. No
            more than the target amount (if a target has been set) can be
            distributed by the project in a single funding cycle, and funding
            reconfigurations won't take effect until the start of the next
            funding cycle.
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
            <span style={{ fontWeight: 600 }}>Duration not set:</span> Funding
            can be reconfigured at any time, which will start a new funding
            cycle.
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
