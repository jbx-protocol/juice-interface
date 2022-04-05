import { t, Trans } from '@lingui/macro'

import { Form } from 'antd'

import { useCallback, useContext, useEffect, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import { helpPagePath } from 'utils/helpPageHelper'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import ProjectPayoutMods from 'components/shared/formItems/ProjectPayoutMods'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { V2CurrencyOption } from 'models/v2/currencyOption'

import { useAppDispatch } from 'hooks/AppDispatch'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { V2UserContext } from 'contexts/v2/userContext'
import { useAppSelector } from 'hooks/AppSelector'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import { sanitizeSplit, toMod, toSplit } from 'utils/v2/splits'

import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import { toV1Currency } from 'utils/v1/currency'
import { toV2Currency, V2_CURRENCY_ETH } from 'utils/v2/currency'

import ExternalLink from 'components/shared/ExternalLink'

import { Split } from 'models/v2/splits'

import { formatFee } from 'utils/v2/math'

import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'

import { shadowCard } from 'constants/styles/shadowCard'
import FormActionbar from '../../FormActionBar'

import FundingTypeSelect, { FundingType } from './FundingTypeSelect'
import { TabContentProps } from '../../models'
import ProjectConfigurationFieldsContainer from '../ProjectConfigurationFieldsContainer'
import FundingCycleExplainer from '../../FundingCycleExplainer'

type FundingFormFields = {
  duration?: string
}

export default function FundingTabContent({
  onFinish,
  showPreview,
  saveButton,
}: TabContentProps) {
  const { theme } = useContext(ThemeContext)
  const { contracts } = useContext(V2UserContext)
  const dispatch = useAppDispatch()

  const [fundingForm] = Form.useForm<FundingFormFields>()

  const [splits, setSplits] = useState<Split[]>([])
  const [target, setTarget] = useState<string | undefined>()
  const [targetCurrency, setTargetCurrency] =
    useState<V2CurrencyOption>(V2_CURRENCY_ETH)
  const [fundingType, setFundingType] = useState<FundingType>('recurring')

  const { fundAccessConstraints, fundingCycleData, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)

  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const feeFormatted = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  const resetProjectForm = useCallback(() => {
    const _target = fundAccessConstraint?.distributionLimit
    const _targetCurrency = parseInt(
      fundAccessConstraint?.distributionLimitCurrency ?? `${V2_CURRENCY_ETH}`,
    ) as V2CurrencyOption

    fundingForm.setFieldsValue({
      duration: fundingCycleData?.duration,
    })
    setTarget(_target)
    setTargetCurrency(_targetCurrency)
    setSplits(payoutGroupedSplits.splits)

    if (parseInt(fundingCycleData?.duration ?? 0) > 0) {
      setFundingType('recurring')
    } else if (parseInt(_target ?? '0') > 0) {
      setFundingType('target')
    } else {
      setFundingType('no_target')
    }
  }, [fundingForm, fundingCycleData, fundAccessConstraint, payoutGroupedSplits])

  const onFundingFormSave = useCallback(
    (fields: FundingFormFields) => {
      if (!contracts) throw new Error('Failed to save funding configuration.')

      let fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
        undefined
      if (target) {
        fundAccessConstraint = {
          terminal: contracts.JBETHPaymentTerminal.address,
          distributionLimit: target,
          distributionLimitCurrency: targetCurrency.toString(),
          overflowAllowance: '0', // nothing for the time being.
          overflowAllowanceCurrency: '0',
        }
      }

      dispatch(
        editingV2ProjectActions.setFundAccessConstraints(
          fundAccessConstraint ? [fundAccessConstraint] : [],
        ),
      )
      dispatch(
        editingV2ProjectActions.setPayoutSplits(splits.map(sanitizeSplit)),
      )
      dispatch(editingV2ProjectActions.setDuration(fields.duration ?? '0'))

      onFinish?.()
    },
    [splits, contracts, dispatch, target, targetCurrency, onFinish],
  )

  const onFundingTypeSelect = (newFundingType: FundingType) => {
    // reset fields if "no target" is selected
    if (newFundingType === 'no_target') {
      setTarget(undefined)
      fundingForm.setFieldsValue({ duration: '0' })
    }
    setFundingType(newFundingType)
  }

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  const isFundingTargetSectionVisible =
    fundingType === 'target' || fundingType === 'recurring'
  const isFundingDurationVisible = fundingType === 'recurring'

  return (
    <ProjectConfigurationFieldsContainer showPreview={showPreview}>
      <FundingCycleExplainer />
      <Form form={fundingForm} layout="vertical" onFinish={onFundingFormSave}>
        <Form.Item label={t`How much do you want to raise?`}>
          <FundingTypeSelect
            value={fundingType}
            onChange={onFundingTypeSelect}
          />
        </Form.Item>

        {isFundingTargetSectionVisible ? (
          <div
            style={{
              padding: '2rem',
              marginBottom: '10px',
              ...shadowCard(theme),
              color: theme.colors.text.primary,
            }}
          >
            <h3>Funding target</h3>
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
                Overflow is created if your project's balance exceeds your
                funding cycle target. Overflow can be redeemed by your project's
                token holders.
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

            {isFundingDurationVisible && (
              <Form.Item
                name="duration"
                label="Funding cycle duration (seconds)"
                required
              >
                <FormattedNumberInput
                  placeholder="86400"
                  suffix="seconds"
                  min={1}
                />
              </Form.Item>
            )}

            <Form.Item label={t`Funding target`} required>
              <BudgetTargetInput
                target={target?.toString()}
                targetSubFee={undefined}
                currency={toV1Currency(targetCurrency)}
                onTargetChange={setTarget}
                onTargetSubFeeChange={() => {}}
                onCurrencyChange={v1Currency =>
                  setTargetCurrency(toV2Currency(v1Currency))
                }
                showTargetSubFeeInput={false}
                feePerbicent={undefined}
              />
            </Form.Item>
          </div>
        ) : (
          <p style={{ color: theme.colors.text.primary }}>
            <Trans>
              All funds can be distributed by the project. The project will have
              no overflow (the same as setting the target to infinity).
            </Trans>
          </p>
        )}

        <div
          style={{
            padding: '2rem',
            marginBottom: '1rem',
            ...shadowCard(theme),
          }}
        >
          <h3>
            <Trans>Payouts</Trans>
          </h3>
          <p style={{ color: theme.colors.text.primary }}>
            Distributing payouts to non-Juicebox projects incurs {feeFormatted}%
            fee. Your project will recieve an equivalent amount of JBX tokens in
            return, giving you ownership of network.
          </p>
          <ProjectPayoutMods
            mods={splits.map(toMod)}
            target={target ?? '0'}
            currency={toV1Currency(targetCurrency)}
            feePerbicent={ETHPaymentTerminalFee}
            onModsChanged={newMods => {
              setSplits(newMods.map(toSplit))
            }}
          />
        </div>

        {/* Default to floating save button if custom one not given */}
        {saveButton ?? <FormActionbar />}
      </Form>
    </ProjectConfigurationFieldsContainer>
  )
}
