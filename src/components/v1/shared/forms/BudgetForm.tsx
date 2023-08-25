import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Switch } from 'antd'
import ExternalLink from 'components/ExternalLink'
import FormItemWarningText from 'components/FormItemWarningText'
import { FormItems } from 'components/formItems'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { constants } from 'ethers'

import { useTerminalFee } from 'hooks/v1/useTerminalFee'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useEditingV1FundingCycleSelector } from 'redux/hooks/useAppSelector'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad } from 'utils/format/formatNumber'
import { helpPagePath } from 'utils/routes'
import { V1CurrencyName, getV1CurrencyOption } from 'utils/v1/currency'
import { isRecurring } from 'utils/v1/fundingCycle'
import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'utils/v1/payouts'

import {
  CYCLE_EXPLANATION,
  DISTRIBUTION_LIMIT_EXPLANATION,
} from 'components/strings'
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

  const dispatch = useAppDispatch()
  const { terminal } = useContext(V1ProjectContext)
  const editingFC = useEditingV1FundingCycleSelector()

  const terminalFee = useTerminalFee(terminal?.version)

  useLayoutEffect(() => {
    setCurrency(V1CurrencyName(initialCurrency) ?? 'ETH')
    setTarget(initialTarget)
    setTargetSubFee(targetToTargetSubFeeFormatted(initialTarget, terminalFee))
    setDuration(initialDuration)
  }, [initialCurrency, initialDuration, initialTarget, terminalFee])

  const maxIntStr = fromWad(constants.MaxUint256)
  const hasTarget = useMemo(() => {
    return target !== maxIntStr
  }, [target, maxIntStr])

  return (
    <Space direction="vertical" size="large" className="w-full">
      <h1>
        <Trans>Cycle</Trans>
      </h1>

      {CYCLE_EXPLANATION}

      <Form layout="vertical">
        <div className="text-grey-500 dark:text-grey-300">
          <h4>
            <Trans>Payouts</Trans>
          </h4>
          <p>{DISTRIBUTION_LIMIT_EXPLANATION}</p>
        </div>

        <Space direction="vertical" size="middle">
          <Space>
            <Switch
              checked={target === maxIntStr}
              onChange={checked => {
                const targetSubFee = checked
                  ? maxIntStr
                  : DEFAULT_TARGET_AFTER_FEE
                setTargetSubFee(targetSubFee)
                setTarget(
                  targetSubFeeToTargetFormatted(targetSubFee, terminalFee),
                )
                setCurrency('USD')
              }}
            />
            <label>
              <Trans>Unlimited payouts</Trans>
            </label>
          </Space>
          {hasTarget ? (
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
                  targetSubFeeToTargetFormatted(
                    targetSubFee ?? '0',
                    terminalFee,
                  ),
                )
              }}
              currency={currency}
              onCurrencyChange={setCurrency}
              feePerbicent={terminalFee}
            />
          ) : (
            <p className="text-black dark:text-slate-100">
              <span className="font-medium">
                <Trans>Unlimited payouts.</Trans>{' '}
              </span>
              <Trans>
                All ETH can be paid out from the project. No ETH will be
                available for redemptions.
              </Trans>
            </p>
          )}
        </Space>

        {target === '0' && (
          <p className="text-black dark:text-slate-100">
            <Trans>
              <span className="font-medium">No payouts.</span> All of the
              project's ETH will be available for redemptions.
            </Trans>
          </p>
        )}

        <Divider className="my-10 mx-0 border-smoke-200 dark:border-grey-600" />

        <div>
          <h4>
            <Trans>Cycle duration</Trans>
          </h4>
          <p className="text-grey-500 dark:text-grey-300">
            <Trans>
              Your rules are locked during a cycle. With no duration, edits can
              be made at any time.
            </Trans>{' '}
            <Trans>
              <ExternalLink
                href={helpPagePath('dev/learn/glossary/funding-cycle')}
              >
                Learn more
              </ExternalLink>{' '}
              about cycles.
            </Trans>
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
          <p className="mt-5 text-black dark:text-slate-100">
            <Trans>
              <span className="font-medium">No cycle duration.</span>
              You can edit your rules and start new cycles at any time.
            </Trans>
            <FormItemWarningText>
              <Trans>
                Using a duration is recommended. Without one, you can edit your
                cycle at any time, which may appear risky.
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
            <Trans>Save rules</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
