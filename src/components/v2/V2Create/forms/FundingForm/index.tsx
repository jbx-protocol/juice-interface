import { Trans } from '@lingui/macro'

import { Button, Form, Space } from 'antd'

import { useCallback, useContext, useLayoutEffect, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import { helpPagePath } from 'utils/helpPageHelper'
import ProjectPayoutMods from 'components/shared/formItems/ProjectPayoutMods'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { V2CurrencyOption } from 'models/v2/currencyOption'

import { useAppDispatch } from 'hooks/AppDispatch'
import {
  defaultFundingCycleData,
  defaultFundingCycleMetadata,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { V2UserContext } from 'contexts/v2/userContext'
import { useAppSelector } from 'hooks/AppSelector'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import { sanitizeSplit, toMod, toSplit } from 'utils/v2/splits'

import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import {
  getV2CurrencyOption,
  V2CurrencyName,
  V2_CURRENCY_ETH,
} from 'utils/v2/currency'

import ExternalLink from 'components/shared/ExternalLink'

import { Split } from 'models/v2/splits'

import { formatFee, MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'
import { CurrencyContext } from 'contexts/currencyContext'
import {
  deriveDurationUnit,
  secondsToOtherUnit,
  otherUnitToSeconds,
} from 'utils/formatTime'
import { fromWad, parseWad } from 'utils/formatNumber'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import { Link } from 'react-router-dom'

import FormItemWarningText from 'components/shared/FormItemWarningText'

import SwitchHeading from 'components/shared/SwitchHeading'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

import { shadowCard } from 'constants/styles/shadowCard'
import TargetTypeSelect, { TargetType } from './TargetTypeSelect'
import DurationInputAndSelect from './DurationInputAndSelect'
import { DurationUnitsOption } from 'constants/time'

type FundingFormFields = {
  duration?: string
  durationUnit?: DurationUnitsOption
  durationEnabled?: boolean
}

export default function FundingForm({ onFinish }: { onFinish: VoidFunction }) {
  const { theme } = useContext(ThemeContext)
  const { contracts } = useContext(V2UserContext)

  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const dispatch = useAppDispatch()

  const [fundingForm] = Form.useForm<FundingFormFields>()

  const [splits, setSplits] = useState<Split[]>([])
  const [target, setTarget] = useState<string | undefined>()

  const [targetCurrency, setTargetCurrency] =
    useState<V2CurrencyOption>(V2_CURRENCY_ETH)
  const [durationEnabled, setDurationEnabled] = useState<boolean>(false)
  const [targetType, setTargetType] = useState<TargetType>('specific')

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const feeFormatted = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  // Load redux state (will be empty in create flow)
  const { fundAccessConstraints, fundingCycleData, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  // Loads redux state into form
  const resetProjectForm = useCallback(() => {
    const _target = fundAccessConstraint?.distributionLimit ?? '0'
    const _targetCurrency = parseInt(
      fundAccessConstraint?.distributionLimitCurrency ?? '0',
    ) as V2CurrencyOption

    const durationSeconds = fundingCycleData
      ? parseInt(fundingCycleData.duration)
      : 0
    setDurationEnabled(durationSeconds > 0)

    const durationUnit = deriveDurationUnit(durationSeconds)

    fundingForm.setFieldsValue({
      durationUnit: durationUnit,
      duration: secondsToOtherUnit({
        duration: durationSeconds,
        unit: durationUnit,
      }).toString(),
    })

    setTarget(_target)
    setTargetCurrency(_targetCurrency)
    setSplits(payoutGroupedSplits?.splits ?? [])

    if (parseInt(_target ?? '0') === 0) {
      setTargetType('none')
    } else if (parseWad(_target).eq(MAX_DISTRIBUTION_LIMIT)) {
      setTargetType('infinite')
    } else {
      setTargetType('specific')
    }
  }, [fundingForm, fundingCycleData, fundAccessConstraint, payoutGroupedSplits])

  const onFundingFormSave = useCallback(
    (fields: FundingFormFields) => {
      if (!contracts) throw new Error('Failed to save funding configuration.')

      const fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
        {
          terminal: contracts.JBETHPaymentTerminal.address,
          token: ETH_TOKEN_ADDRESS,
          distributionLimit: target ?? fromWad(MAX_DISTRIBUTION_LIMIT),
          distributionLimitCurrency:
            targetCurrency?.toString() ?? V2_CURRENCY_ETH,
          overflowAllowance: '0', // nothing for the time being.
          overflowAllowanceCurrency: '0',
        }

      const duration = fields?.duration ? parseInt(fields?.duration) : 0
      const durationUnit = fields?.durationUnit ?? 'days'

      const durationInSeconds = otherUnitToSeconds({
        duration: duration,
        unit: durationUnit,
      }).toString()

      dispatch(
        editingV2ProjectActions.setFundAccessConstraints(
          fundAccessConstraint ? [fundAccessConstraint] : [],
        ),
      )
      dispatch(
        editingV2ProjectActions.setPayoutSplits(splits.map(sanitizeSplit)),
      )
      dispatch(editingV2ProjectActions.setDuration(durationInSeconds ?? '0'))

      // reset discount rate if duration is 0
      if (!durationInSeconds || durationInSeconds === '0') {
        dispatch(
          editingV2ProjectActions.setDiscountRate(
            defaultFundingCycleData.discountRate,
          ),
        )
      }

      // reset redemption rate if target is 0
      if (!target || target === '0') {
        dispatch(
          editingV2ProjectActions.setRedemptionRate(
            defaultFundingCycleMetadata.redemptionRate,
          ),
        )
      }

      onFinish?.()
    },
    [splits, contracts, dispatch, target, targetCurrency, onFinish],
  )

  // initially fill form with any existing redux state
  useLayoutEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  const onTargetTypeSelect = (type: TargetType) => {
    setTargetType(type)
    switch (type) {
      case 'infinite':
        setTarget(undefined)
        break
      case 'none':
        setSplits([])
        setTarget('0')
        break
      case 'specific':
        setTarget('0')
        break
    }
  }
  return (
    <Form form={fundingForm} layout="vertical" onFinish={onFundingFormSave}>
      <div
        style={{
          padding: '2rem',
          marginBottom: '10px',
          ...shadowCard(theme),
          color: theme.colors.text.primary,
        }}
      >
        <SwitchHeading
          checked={durationEnabled}
          onChange={checked => {
            setDurationEnabled(checked)

            if (!checked) {
              fundingForm.setFieldsValue({ duration: '0' })
            }
            fundingForm.setFieldsValue({ duration: '30' })
          }}
        >
          <Trans>Funding cycles</Trans>
        </SwitchHeading>

        <Space size="middle" direction="vertical">
          <div>
            <p>
              <Trans>
                Set the length of your funding cycles, which can enable:
              </Trans>
            </p>
            <ol style={{ marginBottom: 0 }}>
              <li>
                <Trans>
                  <strong>Recurring funding cycles</strong> (for example,
                  distribute $30,000 from your project's treasury every 30
                  days).
                </Trans>
              </li>
              <li>
                <Trans>
                  A <strong>discount rate</strong> to automatically reduce the
                  issue rate of your project's token (tokens/ETH) each new
                  funding cycle.
                </Trans>
              </li>
              <li>
                <Trans>
                  Restrict how the owner can reconfigure upcoming funding cycles
                  to mitigate abuse of power.{' '}
                  <ExternalLink
                    href={'https://info.juicebox.money/docs/learn/risks'}
                  >
                    Learn more.
                  </ExternalLink>
                </Trans>
              </li>
            </ol>
          </div>

          {durationEnabled && (
            <DurationInputAndSelect
              defaultDurationUnit={fundingForm.getFieldValue('durationUnit')}
            />
          )}
        </Space>
      </div>

      <div
        style={{
          padding: '2rem',
          marginBottom: '10px',
          ...shadowCard(theme),
          color: theme.colors.text.primary,
        }}
      >
        <h3>
          <Trans>Distribution</Trans>
        </h3>
        <p>
          <Trans>
            Set the amount of funds you'd like to distribute from your treasury
            each funding cycle.
          </Trans>
        </p>
        <p>
          <Trans>
            Any treasury funds within the distribution limit can be paid out to
            destinations that you can define as <strong>splits</strong>.{' '}
            <ExternalLink
              href={'https://info.juicebox.money/docs/learn/glossary/splits'}
            >
              Learn more
            </ExternalLink>{' '}
            about payout splits.
          </Trans>
        </p>
        <p>
          <Trans>
            Any treasury funds in excess of the distribution limit is called{' '}
            <strong>overflow</strong>. Overflow can be claimed by your project's
            token holders by redeeming their tokens.{' '}
            <ExternalLink href={helpPagePath('protocol/learn/topics/overflow')}>
              Learn more
            </ExternalLink>{' '}
            about overflow.
          </Trans>
        </p>

        <Form.Item label={<Trans>Distribution limit</Trans>}>
          <TargetTypeSelect value={targetType} onChange={onTargetTypeSelect} />
        </Form.Item>

        {targetType === 'specific' ? (
          <Form.Item required>
            <BudgetTargetInput
              target={target?.toString()}
              targetSubFee={undefined}
              currency={V2CurrencyName(targetCurrency) ?? 'ETH'}
              onTargetChange={setTarget}
              onTargetSubFeeChange={() => {}}
              onCurrencyChange={currencyName =>
                setTargetCurrency(getV2CurrencyOption(currencyName))
              }
              showTargetSubFeeInput={false}
              feePerbicent={undefined}
            />
          </Form.Item>
        ) : targetType === 'infinite' ? (
          <FormItemWarningText>
            <Trans>
              With an infinite distribution limit, all funds can be distributed
              by the project. The project will have no overflow, meaning token
              holders won't be able to redeem their tokens for treasury funds.
            </Trans>
          </FormItemWarningText>
        ) : (
          <FormItemWarningText>
            <Trans>
              With a distribution limit of Zero, no funds can be distributed by
              the project. All funds belong to token holders as overflow.
            </Trans>
          </FormItemWarningText>
        )}
      </div>

      <div
        style={{
          padding: '2rem',
          marginBottom: '1rem',
          ...shadowCard(theme),
        }}
      >
        <h3>
          <Trans>Payout splits</Trans>
        </h3>
        {targetType !== 'none' ? (
          <>
            <p style={{ color: theme.colors.text.primary }}>
              Distributing payouts to addresses outside the Juicebox contracts
              incurs a {feeFormatted}% JBX membership fee. The ETH from the fee
              will go to the <Link to="/p/juicebox">JuiceboxDAO treasury</Link>,
              and the resulting JBX will go to the project's owner.
            </p>

            <ProjectPayoutMods
              mods={splits.map(toMod)}
              target={target ?? '0'}
              currencyName={targetCurrency === ETH ? 'ETH' : 'USD'}
              feePercentage={
                ETHPaymentTerminalFee
                  ? formatFee(ETHPaymentTerminalFee)
                  : undefined
              }
              onModsChanged={newMods => {
                setSplits(newMods.map(toSplit))
              }}
              targetIsInfinite={targetType === 'infinite'}
            />
          </>
        ) : (
          <FormItemWarningText>
            <Trans>
              Payout splits can't be scheduled when the distribution limit is
              Zero.
            </Trans>
          </FormItemWarningText>
        )}
      </div>

      <Form.Item style={{ marginTop: '2rem' }}>
        <Button htmlType="submit" type="primary">
          <Trans>Save funding configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
