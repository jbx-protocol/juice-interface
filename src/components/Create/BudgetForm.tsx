import { Button, Divider, Form, Space, Switch } from 'antd'
import { Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useLayoutEffect, useState, useMemo } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad } from 'utils/formatNumber'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'
import { helpPagePath } from 'utils/helpPageHelper'

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
  const hasTarget = useMemo(() => {
    return target !== maxIntStr
  }, [target, maxIntStr])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>
        <Trans>Funding</Trans>
      </h1>

      <p>
        <Trans>
          Your project is funded across funding cycles. A funding cycle has a
          funding target and a duration. Your project's funding cycle
          configuration will depend on the kind of project you're starting.
        </Trans>{' '}
        <a
          href={helpPagePath('protocol/learn/topics/funding-cycle')}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Trans>Learn more</Trans>
        </a>{' '}
        <Trans>about funding cycles.</Trans>
      </p>

      <Form layout="vertical">
        <div style={{ color: colors.text.secondary }}>
          <h4>
            <Trans>Funding target</Trans>
          </h4>
          <p>
            <Trans>
              Set the amount of funds you'd like to raise each funding cycle.
              Any funds raised within the funding target can be distributed by
              project, and can't be redeemed by holders of your project's token.
            </Trans>
          </p>
          <p>
            <Trans>
              Overflow is created if your project's balance exceeds your funding
              target. Overflow can be redeemed by holders of your project's
              token.
            </Trans>{' '}
            <a
              href={helpPagePath('protocol/learn/topics/overflow')}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Trans>Learn more</Trans>
            </a>{' '}
            <Trans>about overflow.</Trans>
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
            <label>
              <Trans>Set a funding target</Trans>
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
            value={target.toString()}
            onValueChange={val => setTarget(val || '0')}
            currency={currency}
            onCurrencyChange={setCurrency}
            fee={adminFeePercent}
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
            <a
              href={helpPagePath('protocol/learn/topics/overflow')}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Trans>Learn more</Trans>
            </a>{' '}
            <Trans>about overflow.</Trans>
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
            <a
              href={helpPagePath('protocol/learn/topics/funding-cycle')}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Trans>Learn more</Trans>
            </a>{' '}
            <Trans>about funding cycle duration.</Trans>
          </p>

          {hasTarget && (
            <p style={{ color: colors.text.secondary }}>
              <span style={{ fontWeight: 600 }}>
                <Trans>You have set a target amount.</Trans>
              </span>{' '}
              <Trans>
                No more than the target amount can be distributed by the project
                in a single funding cycle.
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
            </Trans>
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
