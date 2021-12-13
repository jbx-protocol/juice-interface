import { Button, Divider, Form, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleSelector } from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/TerminalFee'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useLayoutEffect, useState, useMemo } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'
import { helpPagePath } from 'utils/helpPageHelper'
import { fromWad } from 'utils/formatNumber'
import {
  targetToTargetSubFeeFormatted,
  targetSubFeeToTargetFormatted,
} from 'components/shared/formItems/formHelpers'

const DEFAULT_TARGET_AFTER_FEE = '10000'

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
  const [targetSubFee, setTargetSubFee] = useState<string>('0')
  const [duration, setDuration] = useState<string>('0')
  const [showFundingFields, setShowFundingFields] = useState<boolean>()
  const editingFC = useEditingFundingCycleSelector()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()
  const { terminal } = useContext(ProjectContext)
  const { contracts } = useContext(UserContext)

  const terminalFee = useTerminalFee(terminal?.version, contracts)

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setTarget(initialTarget)
    setTargetSubFee(targetToTargetSubFeeFormatted(initialTarget, terminalFee))
    setDuration(initialDuration)
    setShowFundingFields(hasFundingTarget(editingFC))
  }, [editingFC, initialCurrency, initialDuration, initialTarget, terminalFee])

  const maxIntStr = fromWad(constants.MaxUint256)
  const hasTarget = useMemo(() => {
    return target !== maxIntStr
  }, [target, maxIntStr])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding</h1>

      <p>
        Your project is funded across funding cycles. A funding cycle has a
        funding target and a duration. Your project's funding cycle
        configuration will depend on the kind of project you're starting.{' '}
        <a
          href={helpPagePath('protocol/learn/topics/funding-cycle')}
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>{' '}
        about funding cycles.
      </p>

      <Form layout="vertical">
        <div style={{ color: colors.text.secondary }}>
          <h4>Funding cycle target</h4>
          <p>
            Set the amount of funds you'd like to raise each funding cycle. Any
            funds raised within the funding cycle target can be distributed by
            the project, and can't be redeemed by your project's token holders.
          </p>
          <p>
            Funds within the funding cycle target can be distributed at any time
            during the funding cycle. Distributing funds is a public action;
            anyone can call the transaction on your behalf.
          </p>
          <p>
            Overflow is created if your project's balance exceeds your funding
            cycle target. Overflow can be redeemed by your project's token
            holders.{' '}
            <a
              href={helpPagePath('protocol/learn/topics/overflow')}
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </a>{' '}
            about overflow.
          </p>
        </div>

        <Form.Item>
          <Space>
            <Switch
              checked={showFundingFields}
              onChange={checked => {
                const targetSubFee = checked
                  ? DEFAULT_TARGET_AFTER_FEE
                  : maxIntStr || '0'
                setTargetSubFee(targetSubFee)
                setTarget(
                  targetSubFeeToTargetFormatted(targetSubFee, terminalFee),
                )
                setCurrency(1)
                setShowFundingFields(checked)
              }}
            />
            <label>Set a funding cycle target</label>
          </Space>
        </Form.Item>

        {!hasTarget && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>No target set.</span> All funds
            can be distributed by the project. The project will have no overflow
            (the same as setting the target to infinity).
          </p>
        )}

        {showFundingFields && (
          <FormItems.ProjectTarget
            formItemProps={{
              rules: [{ required: true }],
              extra: null,
            }}
            target={target}
            targetSubFee={targetSubFee}
            onTargetChange={target => {
              setTarget(target ?? '0')
              setTargetSubFee(
                targetToTargetSubFeeFormatted(target ?? '0', terminalFee),
              )
            }}
            onTargetSubFeeChange={targetSubFee => {
              setTargetSubFee(targetSubFee ?? '0')
              setTarget(
                targetSubFeeToTargetFormatted(targetSubFee ?? '0', terminalFee),
              )
            }}
            currency={currency}
            onCurrencyChange={setCurrency}
            fee={terminalFee}
          />
        )}

        {showFundingFields && target === '0' && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>Target is 0.</span> The project's
            entire balance will be considered overflow.{' '}
            <a
              href={helpPagePath('protocol/learn/topics/overflow')}
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </a>{' '}
            about overflow.
          </p>
        )}

        <Divider
          style={{
            margin: '40px 0',
            borderColor: colors.stroke.tertiary,
          }}
        />

        <div>
          <h4>Funding cycle duration</h4>
          <p style={{ color: colors.text.secondary }}>
            Set the length of your funding cycles.{' '}
            <a
              href={helpPagePath('protocol/learn/topics/funding-cycle')}
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </a>{' '}
            about funding cycle duration.
          </p>

          {hasTarget && (
            <p style={{ color: colors.text.secondary }}>
              <span style={{ fontWeight: 600 }}>
                You have set a funding cycle target.
              </span>{' '}
              No more than the funding cycle target can be distributed by the
              project in a single funding cycle.
            </p>
          )}
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
            <span style={{ fontWeight: 600 }}>No duration set.</span> Funding
            can be reconfigured at any time. Reconfigurations will start a new
            funding cycle.
          </p>
        )}

        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(currency, target, duration)}
          >
            Save funding configuration
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
