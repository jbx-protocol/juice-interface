import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Switch } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { FormItems } from 'components/formItems'
import FormItemWarningText from 'components/FormItemWarningText'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingV1FundingCycleSelector } from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/v1/TerminalFee'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { helpPagePath } from 'utils/routes'
import { getV1CurrencyOption, V1CurrencyName } from 'utils/v1/currency'
import { hasFundingTarget, isRecurring } from 'utils/v1/fundingCycle'
import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'utils/v1/payouts'

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
    <Space direction="vertical" size="large" className="w-full">
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
          <ExternalLink href={helpPagePath('dev/learn/glossary/funding-cycle')}>
            Learn more
          </ExternalLink>{' '}
          about funding cycles.
        </Trans>
      </p>

      <Form layout="vertical">
        <div className="text-grey-500 dark:text-grey-300">
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
              <ExternalLink href={helpPagePath('dev/learn/glossary/overflow')}>
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
          <p className="text-black dark:text-slate-100">
            <span className="font-medium">
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
          <p className="text-black dark:text-slate-100">
            <Trans>
              <span className="font-medium">Target is 0.</span> The project's
              entire balance will be considered overflow.{' '}
              <ExternalLink href={helpPagePath('dev/learn/glossary/overflow')}>
                Learn more
              </ExternalLink>{' '}
              about overflow.
            </Trans>
          </p>
        )}

        <Divider className="my-10 mx-0 border-smoke-200 dark:border-grey-600" />

        <div>
          <h4>
            <Trans>Funding cycle duration</Trans>
          </h4>
          <p className="text-grey-500 dark:text-grey-300">
            <Trans>Set the length of your funding cycles.</Trans>{' '}
            <Trans>
              <ExternalLink
                href={helpPagePath('dev/learn/glossary/funding-cycle')}
              >
                Learn more
              </ExternalLink>{' '}
              about funding cycle duration.
            </Trans>
          </p>

          {hasTarget && (
            <p className="text-grey-500 dark:text-grey-300">
              <span className="font-medium">
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
          <p className="mt-5 text-black dark:text-slate-100">
            <Trans>
              <span className="font-medium">No duration set.</span>
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
            className="mt-5"
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
