import { t, Trans } from '@lingui/macro'

import { Form, Row, Col } from 'antd'

import { useCallback, useContext, useEffect, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import { helpPagePath } from 'utils/helpPageHelper'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import ProjectPayoutMods from 'components/shared/formItems/ProjectPayoutMods'
import { PayoutMod } from 'models/mods'
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

import ExternalLink from 'components/shared/ExternalLink'

import { V2_CURRENCY_ETH } from 'constants/v2/currency'
import { shadowCard } from 'constants/styles/shadowCard'
import FormActionbar from '../../FormActionBar'
import { formBottomMargin } from '../../constants'

import FundingTypeSelect, { FundingType } from './FundingTypeSelect'
import FundingTargetInput from './FundingTargetInput'
import FormItemLabel from '../../FormItemLabel'
import { TabContentProps } from '../../models'

type FundingFormFields = {
  duration?: string
}

export default function FundingTabContent({ onFinish }: TabContentProps) {
  const { theme } = useContext(ThemeContext)
  const { contracts } = useContext(V2UserContext)
  const dispatch = useAppDispatch()

  const [fundingForm] = Form.useForm<FundingFormFields>()

  const [mods, setMods] = useState<PayoutMod[]>([])
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
    setMods(payoutGroupedSplits?.splits.map(split => toMod(split)) ?? [])

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

      const newPayoutSplits = mods.map(mod => sanitizeSplit(toSplit(mod)))

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
      dispatch(editingV2ProjectActions.setPayoutSplits(newPayoutSplits))
      dispatch(editingV2ProjectActions.setDuration(fields.duration ?? '0'))

      onFinish?.()
    },
    [mods, contracts, dispatch, target, targetCurrency, onFinish],
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
    <Row gutter={32} style={{ marginBottom: formBottomMargin }}>
      <Col md={10} xs={24}>
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
                  Set the amount of funds you'd like to raise each funding
                  cycle. Any funds raised within the funding cycle target can be
                  distributed by the project, and can't be redeemed by your
                  project's token holders.
                </Trans>
              </p>
              <p>
                <Trans>
                  Overflow is created if your project's balance exceeds your
                  funding cycle target. Overflow can be redeemed by your
                  project's token holders.
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
                  label={t`Funding cycle duration`}
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
                <FundingTargetInput
                  target={target?.toString() ?? '0'}
                  targetCurrency={targetCurrency}
                  onTargetChange={setTarget}
                  onTargetCurrencyChange={setTargetCurrency}
                  fee={ETHPaymentTerminalFee}
                />
              </Form.Item>
            </div>
          ) : (
            <p style={{ color: theme.colors.text.primary }}>
              <Trans>
                All funds can be distributed by the project. The project will
                have no overflow (the same as setting the target to infinity).
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
            <FormItemLabel>
              <Trans>Payouts</Trans>
            </FormItemLabel>
            <ProjectPayoutMods
              mods={mods}
              target={target ?? '0'}
              currency={toV1Currency(targetCurrency)}
              fee={ETHPaymentTerminalFee}
              onModsChanged={newMods => {
                setMods(newMods)
              }}
            />
          </div>
          <FormActionbar />
        </Form>
      </Col>
      <Col md={12} xs={0}></Col>
    </Row>
  )
}
