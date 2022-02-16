import { t, Trans } from '@lingui/macro'
import { Select, Space, Form, Button } from 'antd'

// import { useAppDispatch } from 'hooks/AppDispatch'
// import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useState } from 'react'

// import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { helpPagePath } from 'utils/helpPageHelper'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import ProjectPayoutMods from 'components/shared/formItems/ProjectPayoutMods'

import { PayoutMod } from 'models/mods'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import { toV1Currency } from 'utils/v1/currency'

import { Split } from 'models/v2/splits'

import { useAppDispatch } from 'hooks/AppDispatch'

import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { V2UserContext } from 'contexts/v2/userContext'

import { useAppSelector } from 'hooks/AppSelector'

import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'components/shared/formItems/formHelpers'

import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'
import { shadowCard } from 'constants/styles/shadowCard'
import { toV2Currency, V2_CURRENCY_ETH } from 'constants/v2/currency'
const { Option } = Select

type FundingFormFields = {
  duration?: string
}

const toSplit = (mod: PayoutMod): Split => {
  const {
    beneficiary,
    percent,
    preferUnstaked,
    lockedUntil,
    projectId,
    allocator,
  } = mod

  return {
    beneficiary,
    percent,
    lockedUntil,
    projectId,
    allocator,
    preferClaimed: preferUnstaked,
  }
}

const toMod = (split: Split): PayoutMod => {
  const {
    beneficiary,
    percent,
    preferClaimed,
    lockedUntil,
    projectId,
    allocator,
  } = split

  return {
    beneficiary,
    percent,
    preferUnstaked: preferClaimed,
    lockedUntil,
    projectId,
    allocator,
  }
}

export default function ProjectDetailsTabContent() {
  const [fundingForm] = Form.useForm<FundingFormFields>()
  const [mods, setMods] = useState<PayoutMod[]>([])
  const [target, setTarget] = useState<string>('0')
  const [targetSubFee, setTargetSubFee] = useState<string>()
  const [targetCurrency, setTargetCurrency] =
    useState<V2CurrencyOption>(V2_CURRENCY_ETH)
  const [fundingType, setFundingType] = useState<string>()
  const { theme } = useContext(ThemeContext)
  const dispatch = useAppDispatch()
  const { contracts } = useContext(V2UserContext)

  const { fundAccessConstraints, fundingCycleData, payoutSplits } =
    useAppSelector(state => state.editingV2Project)

  const fundAccessConstraint = fundAccessConstraints[0] as
    | SerializedV2FundAccessConstraint
    | undefined

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const resetProjectForm = useCallback(() => {
    fundingForm.setFieldsValue({
      duration: fundingCycleData?.duration,
    })
    setMods(payoutSplits?.map(split => toMod(split)) ?? [])
    const _target = fundAccessConstraint?.distributionLimit

    setTarget(_target ?? '0')
    setTargetSubFee(
      targetToTargetSubFeeFormatted(_target ?? '0', ETHPaymentTerminalFee),
    )

    if (fundingCycleData?.duration) {
      setFundingType('recurring')
    } else if (_target) {
      setFundingType('target')
    }

    // setTargetCurrency(
    //   fundAccessConstraint?.distributionLimitCurrency ?? V2_CURRENCY_ETH,
    // )
  }, [
    fundingForm,
    fundingCycleData,
    fundAccessConstraint,
    payoutSplits,
    ETHPaymentTerminalFee,
  ])

  const onFundingFormSave = useCallback(
    (fields: FundingFormFields) => {
      if (!contracts) throw new Error('Failed to save funding configuration.')

      const newPayoutSplits = mods.map(mod => toSplit(mod))

      const fundAccessConstraint = {
        terminal: contracts.JBETHPaymentTerminal.address,
        distributionLimit: target,
        distributionLimitCurrency: '0',
        overflowAllowance: '0',
        overflowAllowanceCurrency: '0',
      }

      dispatch(
        editingV2ProjectActions.setFundAccessConstraints([
          fundAccessConstraint,
        ]),
      )
      dispatch(editingV2ProjectActions.setPayoutSplits(newPayoutSplits))
      dispatch(editingV2ProjectActions.setDuration(fields.duration || ''))
    },
    [mods, contracts, dispatch, target],
  )

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  const onFundingTypeChange = useCallback(value => {
    setFundingType(value)
  }, [])

  const isFundingTargetSectionVisible =
    fundingType === 'target' || fundingType === 'recurring'
  const isFundingDurationVisible = fundingType === 'recurring'

  return (
    <div>
      <Space direction="vertical" size="large">
        <Form form={fundingForm} layout="vertical" onFinish={onFundingFormSave}>
          <Form.Item label={t`How much do you want to raise?`}>
            <Select value={fundingType} onChange={onFundingTypeChange}>
              <Option value="target">
                <Trans>Specific target</Trans>
              </Option>
              <Option value="no_target">
                <Trans>No target (as much as possible)</Trans>
              </Option>
              <Option value="recurring">
                <Trans>Recurring target</Trans>
              </Option>
            </Select>
          </Form.Item>

          {isFundingTargetSectionVisible ? (
            <div
              style={{
                padding: '1rem',
                marginBottom: '10px',
                ...shadowCard(theme),
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

              {isFundingDurationVisible && (
                <Form.Item
                  name={'duration'}
                  label={t`Funding cycle duration`}
                  required
                >
                  <FormattedNumberInput
                    placeholder="30"
                    suffix="days"
                    min={1}
                  />
                </Form.Item>
              )}

              <Form.Item label={t`Funding target`} required>
                <BudgetTargetInput
                  target={target?.toString()}
                  targetSubFee={targetSubFee}
                  currency={toV1Currency(targetCurrency)}
                  onTargetChange={val => {
                    setTarget(val ?? '0')
                    setTargetSubFee(
                      targetToTargetSubFeeFormatted(
                        val?.toString() ?? '0',
                        ETHPaymentTerminalFee,
                      ),
                    )
                  }}
                  onTargetSubFeeChange={val => {
                    setTargetSubFee(val ?? '0')
                    setTarget(
                      targetSubFeeToTargetFormatted(
                        val ?? '0',
                        ETHPaymentTerminalFee,
                      ),
                    )
                  }}
                  onCurrencyChange={val => {
                    setTargetCurrency(toV2Currency(val))
                  }}
                  placeholder="0"
                  fee={ETHPaymentTerminalFee}
                />
              </Form.Item>
            </div>
          ) : (
            <p>
              <Trans>
                All funds can be distributed by the project. The project will
                have no overflow (the same as setting the target to infinity).
              </Trans>
            </p>
          )}

          <div
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              ...shadowCard(theme),
            }}
          >
            <h3>Payouts</h3>
            <ProjectPayoutMods
              mods={mods}
              target={target?.toString() ?? '0'}
              currency={V1_CURRENCY_ETH}
              fee={ETHPaymentTerminalFee}
              onModsChanged={newMods => {
                setMods(newMods)
              }}
            />
          </div>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              <Trans>Save funding details</Trans>
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
