import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'components/shared/formItems/formHelpers'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingV1FundingCycleSelector } from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/v1/TerminalFee'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad, parseWad } from 'utils/formatNumber'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'
import { helpPagePath } from 'utils/helpPageHelper'

const DEFAULT_TARGET_AFTER_FEE = '10000'

export default function BudgetForm({
  initialCurrency,
  initialTarget,
  initialDuration,
  onSave,
}: {
  initialCurrency: V1CurrencyOption
  initialTarget: string
  initialDuration: string
  onSave: (currency: V1CurrencyOption, target: string, duration: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  // State objects avoid antd form input dependency rerendering issues
  const [currency, setCurrency] = useState<V1CurrencyOption>(0)
  const [target, setTarget] = useState<string>('0')
  const [targetSubFee, setTargetSubFee] = useState<string>('0')
  const [duration, setDuration] = useState<string>('0')
  const [showFundingFields, setShowFundingFields] = useState<boolean>()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()
  const { terminal } = useContext(V1ProjectContext)
  const editingFC = useEditingV1FundingCycleSelector()

  const terminalFee = useTerminalFee(terminal?.version)

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setTarget(initialTarget)
    setTargetSubFee(targetToTargetSubFeeFormatted(initialTarget, terminalFee))
    setDuration(initialDuration)
    setShowFundingFields(
      hasFundingTarget({
        target: parseWad(initialTarget),
      }),
    )
  }, [initialCurrency, initialDuration, initialTarget, terminalFee])

  const maxIntStr = fromWad(constants.MaxUint256)
  const hasTarget = useMemo(() => {
    return target !== maxIntStr
  }, [target, maxIntStr])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>
        <Trans>Funding cycle</Trans>
      </h1>

      <p>
        <Trans>
          Your project is funded across funding cycles. A funding cycle has a
          funding target and a duration. Your project's funding cycle
          configuration will depend on the kind of project you're starting.
        </Trans>{' '}
        <Trans>
          <a
            href={helpPagePath('protocol/learn/topics/funding-cycle')}
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>{' '}
          about funding cycles.
        </Trans>
      </p>

      <Form layout="vertical">
        <div style={{ color: colors.text.secondary }}>
          <h4>
            <Trans>Funding cycle target</Trans>
          </h4>
          <p>
            <Trans>
              Set the amount of funds you'd like to raise each funding cycle.
              Any funds raised within the funding cycle target can be
              distributed by the project, and can't be redeemed by your
              project's token holders.
            </Trans>
          </p>
          <p>
            <Trans>
              Overflow is created if your project's balance exceeds your funding
              cycle target. Overflow can be redeemed by your project's token
              holders.
            </Trans>{' '}
            <Trans>
              <a
                href={helpPagePath('protocol/learn/topics/overflow')}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>{' '}
              about overflow.
            </Trans>
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
            <label>
              <Trans>Set a funding cycle target</Trans>
            </label>
          </Space>
        </Form.Item>

        {!hasTarget && (
          <p style={{ color: colors.text.primary }}>
            <span style={{ fontWeight: 600 }}>
              <Trans>No target set.</Trans>{' '}
            </span>
            <Trans>
              All funds can be distributed by the project. The project will have
              no overflow (the same as setting the target to infinity).
            </Trans>
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
            <span style={{ fontWeight: 600 }}>
              <Trans>Target is 0.</Trans>
            </span>
            <Trans>
              The project's entire balance will be considered overflow.{' '}
            </Trans>
            <Trans>
              <a
                href={helpPagePath('protocol/learn/topics/overflow')}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>{' '}
              about overflow.
            </Trans>
          </p>
        )}

        <Divider
          style={{
            margin: '40px 0',
            borderColor: colors.stroke.tertiary,
          }}
        />

        <div>
          <h4>
            <Trans>Funding cycle duration</Trans>
          </h4>
          <p style={{ color: colors.text.secondary }}>
            <Trans>Set the length of your funding cycles.</Trans>{' '}
            <Trans>
              <a
                href={helpPagePath('protocol/learn/topics/funding-cycle')}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>{' '}
              about funding cycle duration.
            </Trans>
          </p>

          {hasTarget && (
            <p style={{ color: colors.text.secondary }}>
              <span style={{ fontWeight: 600 }}>
                <Trans>You have set a funding cycle target.</Trans>
              </span>{' '}
              <Trans>
                No more than the funding cycle target can be distributed by the
                project in a single funding cycle.
              </Trans>
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
            <span style={{ fontWeight: 600 }}>
              <Trans>No duration set.</Trans>{' '}
            </span>
            <Trans>
              Funding can be reconfigured at any time. Reconfigurations will
              start a new funding cycle.
            </Trans>{' '}
            <span style={{ color: colors.text.warn }}>
              <Trans>
                Using a duration is recommended. Allowing funding cycles to be
                reconfigured at any time will appear risky to contributors.
              </Trans>
            </span>
          </p>
        )}

        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(currency, target, duration)}
          >
            <Trans>Save funding configuration</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
