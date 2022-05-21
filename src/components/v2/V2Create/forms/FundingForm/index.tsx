import { t, Trans } from '@lingui/macro'

import { Button, Form, Input, Space } from 'antd'

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { ThemeContext } from 'contexts/themeContext'
import { helpPagePath } from 'utils/helpPageHelper'

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

import { sanitizeSplit } from 'utils/v2/splits'

import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import {
  getV2CurrencyOption,
  V2CurrencyName,
  V2_CURRENCY_ETH,
} from 'utils/v2/currency'

import ExternalLink from 'components/shared/ExternalLink'

import { Split } from 'models/v2/splits'

import {
  DEFAULT_FUNDING_CYCLE_DURATION,
  formatFee,
  MAX_DISTRIBUTION_LIMIT,
} from 'utils/v2/math'

import {
  deriveDurationUnit,
  secondsToOtherUnit,
  otherUnitToSeconds,
} from 'utils/formatTime'
import { fromWad } from 'utils/formatNumber'
import { Link } from 'react-router-dom'

import FormItemWarningText from 'components/shared/FormItemWarningText'

import SwitchHeading from 'components/shared/SwitchHeading'
import DistributionSplitsSection from 'components/v2/shared/DistributionSplitsSection'
import { getTotalSplitsPercentage } from 'utils/v2/distributions'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import isEqual from 'lodash/isEqual'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

import { shadowCard } from 'constants/styles/shadowCard'

import DurationInputAndSelect from './DurationInputAndSelect'
import { DurationUnitsOption } from 'constants/time'

type FundingFormFields = {
  duration?: string
  durationUnit?: DurationUnitsOption
  durationEnabled?: boolean
  totalSplitsPercentage?: number
}

export default function FundingForm({
  onFormUpdated,
  onFinish,
  isCreate,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
  isCreate?: boolean // Instance of FundingForm in create flow
}) {
  const { theme } = useContext(ThemeContext)
  const { contracts } = useContext(V2UserContext)
  const { payoutSplits } = useContext(V2ProjectContext)

  const dispatch = useAppDispatch()

  const [fundingForm] = Form.useForm<FundingFormFields>()

  // Load redux state (will be empty in create flow)
  const { fundAccessConstraints, fundingCycleData, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const [splits, setSplits] = useState<Split[]>([])
  // Must differentiate between splits loaded from redux and
  // ones just added to be able to still edit splits you've
  // added with a lockedUntil
  const [editingSplits, setEditingSplits] = useState<Split[]>([])

  const [distributionLimit, setDistributionLimit] = useState<
    string | undefined
  >(fundAccessConstraint?.distributionLimit ?? '0')

  const [distributionLimitCurrency, setDistributionLimitCurrency] =
    useState<V2CurrencyOption>(V2_CURRENCY_ETH)
  const [durationEnabled, setDurationEnabled] = useState<boolean>(false)

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const feeFormatted = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  // Form initial values set by default
  const initialValues = useMemo(
    () => ({
      durationSeconds: fundingCycleData ? fundingCycleData.duration : '0',
      distributionLimit: fundAccessConstraint?.distributionLimit ?? '0',
      distributionLimitCurrency: parseInt(
        fundAccessConstraint?.distributionLimitCurrency ??
          V2_CURRENCY_ETH.toString(),
      ) as V2CurrencyOption,
      payoutSplits: payoutGroupedSplits.splits,
    }),
    [fundingCycleData, fundAccessConstraint, payoutGroupedSplits],
  )

  const {
    editableSplits,
    lockedSplits,
  }: {
    editableSplits: Split[]
    lockedSplits: Split[]
  } = useMemo(() => {
    const now = new Date().valueOf() / 1000

    // Checks if the given split exists in the projectContext splits.
    // If it doesn't, then it means it was just added or edited is which case
    // we want to still be able to edit it
    const confirmedSplitsIncludesSplit = (split: Split) => {
      let includes = false
      payoutSplits?.forEach(confirmedSplit => {
        if (isEqual(confirmedSplit, split)) {
          includes = true
        }
      })
      return includes
    }

    const isLockedSplit = (split: Split) => {
      return (
        split.lockedUntil &&
        split.lockedUntil > now &&
        !isCreate &&
        confirmedSplitsIncludesSplit(split)
      )
    }

    const lockedSplits = splits?.filter(split => isLockedSplit(split)) ?? []
    const editableSplits = splits?.filter(split => !isLockedSplit(split)) ?? []
    return {
      lockedSplits,
      editableSplits,
    }
  }, [splits, isCreate, payoutSplits])

  useLayoutEffect(() => setEditingSplits(editableSplits), [editableSplits])

  // Loads redux state into form
  const resetProjectForm = useCallback(() => {
    const _distributionLimit = fundAccessConstraint?.distributionLimit ?? '0'
    const _distributionLimitCurrency = parseInt(
      fundAccessConstraint?.distributionLimitCurrency ??
        V2_CURRENCY_ETH.toString(),
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

    const payoutSplits = payoutGroupedSplits?.splits

    setDistributionLimit(_distributionLimit)
    setDistributionLimitCurrency(_distributionLimitCurrency)
    setSplits(payoutSplits ?? [])
  }, [fundingForm, fundingCycleData, fundAccessConstraint, payoutGroupedSplits])

  const onFundingFormSave = useCallback(
    async (fields: FundingFormFields) => {
      if (!contracts) throw new Error('Failed to save funding configuration.')

      const fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
        {
          terminal: contracts.JBETHPaymentTerminal.address,
          token: ETH_TOKEN_ADDRESS,
          distributionLimit:
            distributionLimit ?? fromWad(MAX_DISTRIBUTION_LIMIT),
          distributionLimitCurrency:
            distributionLimitCurrency?.toString() ?? V2_CURRENCY_ETH,
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
        editingV2ProjectActions.setPayoutSplits(
          lockedSplits.concat(editingSplits).map(sanitizeSplit),
        ),
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

      // reset redemption rate if distributionLimit is 0
      if (!distributionLimit || distributionLimit === '0') {
        dispatch(
          editingV2ProjectActions.setRedemptionRate(
            defaultFundingCycleMetadata.redemptionRate,
          ),
        )
      }

      onFinish?.()
    },
    [
      editingSplits,
      lockedSplits,
      contracts,
      dispatch,
      distributionLimit,
      distributionLimitCurrency,
      onFinish,
    ],
  )

  // initially fill form with any existing redux state
  useLayoutEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  // Ensures total split percentages do not exceed 100
  const validateTotalSplitsPercentage = () => {
    if (fundingForm.getFieldValue('totalSplitsPercentage') > 100)
      return Promise.reject(t`Sum of percentages cannot exceed 100%.`)
    return Promise.resolve()
  }

  const onFormChange = useCallback(() => {
    const duration = fundingForm.getFieldValue('duration') as number
    const durationUnit = fundingForm.getFieldValue(
      'durationUnit',
    ) as DurationUnitsOption

    const durationInSeconds = durationEnabled
      ? otherUnitToSeconds({
          duration: duration,
          unit: durationUnit,
        }).toString()
      : '0'
    const splits = lockedSplits.concat(editingSplits).map(sanitizeSplit)
    const hasFormUpdated =
      initialValues.durationSeconds !== durationInSeconds ||
      initialValues.distributionLimit !== distributionLimit ||
      initialValues.distributionLimitCurrency !== distributionLimitCurrency ||
      !isEqual(initialValues.payoutSplits, splits)
    onFormUpdated?.(hasFormUpdated)
  }, [
    durationEnabled,
    editingSplits,
    fundingForm,
    initialValues,
    lockedSplits,
    onFormUpdated,
    distributionLimitCurrency,
    distributionLimit,
  ])

  useEffect(() => {
    onFormChange()
  }, [onFormChange])

  return (
    <Form
      form={fundingForm}
      onValuesChange={onFormChange}
      layout="vertical"
      onFinish={onFundingFormSave}
    >
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
            fundingForm.setFieldsValue({
              duration: DEFAULT_FUNDING_CYCLE_DURATION.toString(),
            })
          }}
        >
          <Trans>Funding cycles</Trans>
        </SwitchHeading>

        <Space size="middle" direction="vertical">
          <div style={{ marginTop: '0.5rem' }}>
            <p>
              <Trans>
                Set the length of your funding cycles, which can enable:
              </Trans>
            </p>
            <ol style={{ marginBottom: 0 }}>
              <li>
                <Trans>
                  <strong>Recurring funding cycles</strong> (for example,
                  distribute $30,000 from your project's treasury every 14
                  days).
                </Trans>
              </li>
              <li>
                <Trans>
                  A <strong>discount rate</strong> to automatically reduce the
                  issuance rate of your project's token (tokens/ETH) each new
                  funding cycle.
                </Trans>
              </li>
            </ol>
          </div>
          {!durationEnabled ? (
            <FormItemWarningText>
              <Trans>
                With no funding cycles, the project's owner can start a new
                funding cycle (Funding Cycle #2) on-demand.{' '}
                <ExternalLink
                  href={'https://info.juicebox.money/docs/protocol/learn/risks'}
                >
                  Learn more.
                </ExternalLink>
              </Trans>
            </FormItemWarningText>
          ) : null}

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
            Set the destination of funds you'd like to distribute from your
            treasury each funding cycle.
          </Trans>
        </p>
        <p>
          <Trans>
            All treasury funds outside of what you pre-program for distribution
            is called <strong>overflow</strong>. Overflow can be claimed by your
            project's token holders by redeeming their tokens.{' '}
            <ExternalLink href={helpPagePath('protocol/learn/topics/overflow')}>
              Learn more
            </ExternalLink>{' '}
            about overflow.
          </Trans>
        </p>

        <p style={{ color: theme.colors.text.primary }}>
          <Trans>
            Distributing payouts to addresses outside the Juicebox contracts
            incurs a {feeFormatted}% JBX membership fee. The ETH from the fee
            will go to the <Link to="/p/juicebox">JuiceboxDAO treasury</Link>,
            and the resulting JBX will go to the project's owner.
          </Trans>
        </p>

        <DistributionSplitsSection
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          currencyName={V2CurrencyName(distributionLimitCurrency) ?? 'ETH'}
          onCurrencyChange={currencyName =>
            setDistributionLimitCurrency(getV2CurrencyOption(currencyName))
          }
          editableSplits={editingSplits}
          lockedSplits={lockedSplits}
          onSplitsChanged={newSplits => {
            setEditingSplits(newSplits)
            fundingForm.setFieldsValue({
              totalSplitsPercentage: getTotalSplitsPercentage(newSplits),
            })
          }}
        />
        <Form.Item
          name={'totalSplitsPercentage'}
          rules={[
            {
              validator: validateTotalSplitsPercentage,
            },
          ]}
        >
          {/* Added a hidden input here because Form.Item needs 
          a child Input to work. Need the parent Form.Item to 
          validate totalSplitsPercentage */}
          <Input hidden type="string" autoComplete="off" />
        </Form.Item>
      </div>

      <Form.Item style={{ marginTop: '2rem' }}>
        <Button htmlType="submit" type="primary">
          <Trans>Save funding configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
