import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import ExternalLink from 'components/ExternalLink'
import FormItemWarningText from 'components/FormItemWarningText'
import SwitchHeading from 'components/SwitchHeading'
import { ItemNoInput } from 'components/formItems/ItemNoInput'
import { durationOptions } from 'components/inputs/DurationInput'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import isEqual from 'lodash/isEqual'
import { Split } from 'models/splits'
import { DurationUnitsOption } from 'models/time'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  DEFAULT_FUNDING_CYCLE_METADATA,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/format/formatNumber'
import {
  deriveDurationUnit,
  otherUnitToSeconds,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
import { emitErrorNotification } from 'utils/notifications'
import { helpPagePath } from 'utils/routes'
import { sanitizeSplit } from 'utils/splits'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
  getV2V3CurrencyOption,
} from 'utils/v2v3/currency'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'
import { getDefaultFundAccessConstraint } from 'utils/v2v3/fundingCycle'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { SerializedV2V3FundAccessConstraint } from 'utils/v2v3/serializers'
import { DistributionSplitsSection } from './DistributionSplitsSection'
import DurationInputAndSelect from './DurationInputAndSelect'
import { FundingCycleExplainerCollapse } from './FundingCycleExplainerCollapse'

type FundingFormFields = {
  duration?: string
  durationUnit?: { label: string; value: DurationUnitsOption }
  durationEnabled?: boolean
  totalSplitsPercentage?: number
}

const DEFAULT_FUNDING_CYCLE_DURATION_DAYS = 14

export function FundingForm({
  onFormUpdated,
  onFinish,
  isCreate,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
  isCreate?: boolean // Instance of FundingForm in create flow
}) {
  const { contracts: projectContracts } = useContext(
    V2V3ProjectContractsContext,
  )
  const { payoutSplits } = useContext(V2V3ProjectContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const [splits, setSplits] = useState<Split[]>([])
  // Must differentiate between splits loaded from redux and
  // ones just added to be able to still edit splits you've
  // added with a lockedUntil
  const [editingSplits, setEditingSplits] = useState<Split[]>([])
  const [distributionLimit, setDistributionLimit] = useState<
    string | undefined
  >('0')
  const [distributionLimitCurrency, setDistributionLimitCurrency] =
    useState<V2V3CurrencyOption>(V2V3_CURRENCY_ETH)
  const [durationEnabled, setDurationEnabled] = useState<boolean>(false)
  const [fundingForm] = Form.useForm<FundingFormFields>()

  const dispatch = useAppDispatch()

  // Load redux state
  const { fundAccessConstraints, fundingCycleData, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2V3FundAccessConstraint>(
      fundAccessConstraints,
    )

  // Form initial values set by default
  const initialValues = useMemo(
    () => ({
      durationSeconds: fundingCycleData ? fundingCycleData.duration : '0',
      distributionLimit: fundAccessConstraint?.distributionLimit ?? '0',
      distributionLimitCurrency: parseInt(
        fundAccessConstraint?.distributionLimitCurrency ??
          V2V3_CURRENCY_ETH.toString(),
      ) as V2V3CurrencyOption,
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

  // Loads redux state into form
  const resetProjectForm = useCallback(() => {
    const _distributionLimit = fundAccessConstraint?.distributionLimit ?? '0'
    const _distributionLimitCurrency = parseInt(
      fundAccessConstraint?.distributionLimitCurrency ??
        V2V3_CURRENCY_ETH.toString(),
    ) as V2V3CurrencyOption

    const durationSeconds = fundingCycleData
      ? parseInt(fundingCycleData.duration)
      : 0
    setDurationEnabled(durationSeconds > 0)

    const durationUnit = deriveDurationUnit(durationSeconds)

    fundingForm.setFieldsValue({
      durationUnit: durationOptions().find(v => v.value === durationUnit),
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
      if (!projectContracts?.JBETHPaymentTerminal) {
        emitErrorNotification('Failed to save edits.')
        console.error(
          'Failed to save form, project JBETHPaymentTerminal not found.',
        )
        return
      }

      const fundAccessConstraint:
        | SerializedV2V3FundAccessConstraint
        | undefined = {
        terminal: projectContracts.JBETHPaymentTerminal.address,
        token: ETH_TOKEN_ADDRESS,
        distributionLimit: distributionLimit ?? fromWad(MAX_DISTRIBUTION_LIMIT),
        distributionLimitCurrency:
          distributionLimitCurrency?.toString() ?? V2V3_CURRENCY_ETH,
        overflowAllowance: '0', // nothing for the time being.
        overflowAllowanceCurrency: '0',
      }

      const duration = fields?.duration ? parseInt(fields?.duration) : 0
      const durationUnit = fields?.durationUnit ?? durationOptions()[0]

      const durationInSeconds = otherUnitToSeconds({
        duration: duration,
        unit: durationUnit.value,
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

      // reset redemption rate if distributionLimit is 0
      if (!distributionLimit || distributionLimit === '0') {
        dispatch(
          editingV2ProjectActions.setRedemptionRate(
            DEFAULT_FUNDING_CYCLE_METADATA.redemptionRate,
          ),
        )
        dispatch(
          editingV2ProjectActions.setBallotRedemptionRate(
            DEFAULT_FUNDING_CYCLE_METADATA.ballotRedemptionRate,
          ),
        )
      }

      onFinish?.()
    },
    [
      editingSplits,
      lockedSplits,
      projectContracts,
      dispatch,
      distributionLimit,
      distributionLimitCurrency,
      onFinish,
    ],
  )

  // Ensures total split percentages do not exceed 100
  const validateTotalSplitsPercentage = () => {
    if (fundingForm.getFieldValue('totalSplitsPercentage') > 100)
      return Promise.reject()
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

  useEffect(() => setEditingSplits(editableSplits), [editableSplits])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

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
        className="mb-2 rounded-sm bg-smoke-75 stroke-none
        p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]"
      >
        <SwitchHeading
          className="mb-4"
          checked={durationEnabled}
          onChange={checked => {
            setDurationEnabled(checked)

            // if no funding cycle, select a 0-ballot
            if (!checked) {
              fundingForm.setFieldsValue({ duration: '0' })
            } else {
              fundingForm.setFieldsValue({
                duration: DEFAULT_FUNDING_CYCLE_DURATION_DAYS.toString(),
              })
            }
          }}
        >
          <Trans>Locked cycles</Trans>
        </SwitchHeading>

        {!durationEnabled ? (
          <FormItemWarningText>
            <Trans>
              With unlocked cycles, the project's owner can edit the project's
              rules and start a new cycle (Cycle #2) at any time.{' '}
              <ExternalLink href={helpPagePath('dev/learn/risks')}>
                Learn more.
              </ExternalLink>
            </Trans>
          </FormItemWarningText>
        ) : null}

        {durationEnabled && <DurationInputAndSelect />}

        <div>
          <FundingCycleExplainerCollapse />
        </div>
      </div>

      <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
        <h3 className="text-lg text-black dark:text-slate-100">
          <Trans>Payouts</Trans>
        </h3>

        <DistributionSplitsSection
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          currencyName={V2V3CurrencyName(distributionLimitCurrency) ?? 'ETH'}
          onCurrencyChange={currencyName =>
            setDistributionLimitCurrency(getV2V3CurrencyOption(currencyName))
          }
          editableSplits={editingSplits}
          lockedSplits={lockedSplits}
          projectOwnerAddress={projectOwnerAddress}
          onSplitsChanged={newSplits => {
            setEditingSplits(newSplits)
            fundingForm.setFieldsValue({
              totalSplitsPercentage: getTotalSplitsPercentage(newSplits),
            })
          }}
        />
        <ItemNoInput
          name={'totalSplitsPercentage'}
          rules={[
            {
              validator: validateTotalSplitsPercentage,
            },
          ]}
        />
      </div>

      <Form.Item className="mt-8">
        <Button htmlType="submit" type="primary">
          <Trans>Save funding configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
