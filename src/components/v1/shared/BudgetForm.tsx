import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import * as constants from '@ethersproject/constants'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingV1FundingCycleSelector } from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/v1/TerminalFee'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad, parseWad } from 'utils/formatNumber'
import { hasFundingTarget, isRecurring } from 'utils/v1/fundingCycle'
import { helpPagePath } from 'utils/helpPageHelper'
import { getV1CurrencyOption, V1CurrencyName } from 'utils/v1/currency'

import FormItemWarningText from 'components/shared/FormItemWarningText'
import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'utils/v1/payouts'

import ExternalLink from '../../shared/ExternalLink'
import { CurrencyName } from 'constants/currency'

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
  const [currency, setCurrency] = useState<CurrencyName>('ETH')
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
    setCurrency(V1CurrencyName(initialCurrency) ?? 'ETH')
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
          <ExternalLink
            href={helpPagePath('protocol/learn/topics/funding-cycle')}
          >
            Learn more
          </ExternalLink>{' '}
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
              <ExternalLink
                href={helpPagePath('protocol/learn/topics/overflow')}
              >
                Learn more
              </ExternalLink>{' '}
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
                setCurrency('USD')
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
            feePerbicent={terminalFee}
          />
        )}

        {showFundingFields && target === '0' && (
          <p style={{ color: colors.text.primary }}>
            <Trans>
              <span style={{ fontWeight: 600 }}>Target is 0.</span> The
              project's entire balance will be considered overflow.{' '}
              <ExternalLink
                href={helpPagePath('protocol/learn/topics/overflow')}
              >
                Learn more
              </ExternalLink>{' '}
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
              <ExternalLink
                href={helpPagePath('protocol/learn/topics/funding-cycle')}
              >
                Learn more
              </ExternalLink>{' '}
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
            <Trans>
              <span style={{ fontWeight: 600 }}>No duration set.</span>
              Funding can be reconfigured at any time. Reconfigurations will
              start a new funding cycle.
            </Trans>
            <FormItemWarningText>
              <Trans>
                Using a duration is recommended. Allowing funding cycles to be
                reconfigured at any time will appear risky to contributors.
              </Trans>
            </FormItemWarningText>
          </p>
        )}

        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() =>
              onSave(getV1CurrencyOption(currency), target, duration)
            }
          >
            <Trans>Save funding configuration</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
