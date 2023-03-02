import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { FormItems } from 'components/formItems'
import { ItemNoInput } from 'components/formItems/ItemNoInput'
import FormItemWarningText from 'components/FormItemWarningText'
import NumberSlider from 'components/inputs/NumberSlider'
import SwitchHeading from 'components/SwitchHeading'
import ReservedTokensFormItem from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer/TokenForm/ReservedTokensFormItem'
import { DISCOUNT_RATE_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import {
  DEFAULT_FUNDING_CYCLE_DATA,
  DEFAULT_FUNDING_CYCLE_METADATA,
  DEFAULT_MINT_RATE,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { formattedNum } from 'utils/format/formatNumber'
import { sanitizeSplit } from 'utils/splits'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'
import {
  getDefaultFundAccessConstraint,
  hasDistributionLimit,
  hasFundingDuration,
} from 'utils/v2v3/fundingCycle'
import {
  discountRateFrom,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'
import { SerializedV2V3FundAccessConstraint } from 'utils/v2v3/serializers'
import MintRateFormItem from './MintRateFormItem'

const MAX_DISCOUNT_RATE = 20 // this is an opinionated limit

function DiscountRateExtra({
  hasDuration,
  initialIssuanceRate,
  discountRatePercent,
  isCreate,
}: {
  hasDuration?: boolean
  initialIssuanceRate: number
  discountRatePercent: number
  isCreate?: boolean
}) {
  const discountRateDecimal = discountRatePercent * 0.01
  const secondIssuanceRate = round(
    initialIssuanceRate - initialIssuanceRate * discountRateDecimal,
    4,
  )

  const thirdIssuanceRate = round(
    secondIssuanceRate - secondIssuanceRate * discountRateDecimal,
    4,
  )

  return (
    <div className="text-sm">
      {!hasDuration && (
        <FormItemWarningText>
          <Trans>Disabled when your project's cycle has no duration.</Trans>
        </FormItemWarningText>
      )}
      <p>{DISCOUNT_RATE_EXPLANATION}</p>
      {discountRatePercent > 0 && isCreate && (
        <>
          <Callout.Info className="mt-5 dark:bg-slate-500" transparent>
            <p>
              <Trans>
                Your project tokens will become{' '}
                <strong>{discountRatePercent}%</strong> more expensive each
                cycle.
              </Trans>
            </p>
            <p>
              <Trans>
                Next cycle, the <strong>token issuance rate</strong> will be{' '}
                <strong className="whitespace-nowrap">
                  {formattedNum(secondIssuanceRate)} tokens per 1 ETH.
                </strong>
                The cycle after that, the token issuance rate will be{' '}
                <strong className="whitespace-nowrap">
                  {' '}
                  {formattedNum(thirdIssuanceRate)} tokens per 1 ETH{' '}
                </strong>
                , and so on.
              </Trans>
            </p>
          </Callout.Info>
        </>
      )}
    </div>
  )
}

export function TokenForm({
  onFormUpdated,
  onFinish,
  isCreate,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
  isCreate?: boolean // If the instance of this form is in the create flow (not reconfig)
}) {
  const [tokenForm] = useForm<{ totalReservedSplitPercent: number }>()

  const dispatch = useAppDispatch()
  const {
    fundingCycleMetadata,
    fundingCycleData,
    reservedTokensGroupedSplits,
    fundAccessConstraints,
  } = useAppSelector(state => state.editingV2Project)
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2V3FundAccessConstraint>(
      fundAccessConstraints,
    )

  const canSetRedemptionRate = hasDistributionLimit(fundAccessConstraint)
  const hasDuration = hasFundingDuration(fundingCycleData)
  const canSetDiscountRate = hasDuration

  // Form initial values set by default
  const initialValues = useMemo(
    () => ({
      reservedRate:
        fundingCycleMetadata.reservedRate ??
        DEFAULT_FUNDING_CYCLE_METADATA.reservedRate,
      discountRate:
        (canSetDiscountRate && fundingCycleData?.discountRate) ||
        DEFAULT_FUNDING_CYCLE_DATA.discountRate,
      redemptionRate:
        (canSetRedemptionRate && fundingCycleMetadata?.redemptionRate) ||
        DEFAULT_FUNDING_CYCLE_METADATA.redemptionRate,
      weight: fundingCycleData?.weight
        ? formatIssuanceRate(fundingCycleData?.weight)
        : DEFAULT_MINT_RATE.toString(),
    }),
    [
      fundingCycleMetadata.reservedRate,
      fundingCycleMetadata?.redemptionRate,
      canSetDiscountRate,
      fundingCycleData?.discountRate,
      fundingCycleData?.weight,
      canSetRedemptionRate,
    ],
  )

  /**
   * NOTE: these values will all be in their 'native' units,
   * e.g. permyriads, parts-per-billion etc.
   *
   * We will convert these to percentages to pass as
   * props later on.
   */
  const [reservedRate, setReservedRate] = useState<string>(
    initialValues.reservedRate,
  )
  const [discountRate, setDiscountRate] = useState<string>(
    initialValues.discountRate,
  )
  const [redemptionRate, setRedemptionRate] = useState<string>(
    initialValues.redemptionRate,
  )
  const [weight, setWeight] = useState<string>(initialValues.weight)

  const [discountRateChecked, setDiscountRateChecked] = useState<boolean>(
    fundingCycleData?.discountRate !== DEFAULT_FUNDING_CYCLE_DATA.discountRate,
  )

  const [reservedTokensSplits, setReservedTokensSplits] = useState<Split[]>(
    reservedTokensGroupedSplits?.splits,
  )

  const onTokenFormSaved = useCallback(async () => {
    await tokenForm.validateFields()
    const newReservedTokensSplits = reservedTokensSplits.map(split =>
      sanitizeSplit(split),
    )
    /**
     * NOTE: all values dispatched to Redux should be in their 'native' units,
     * e.g. permyriads, parts-per-billion etc.
     * and NOT percentages.
     */
    dispatch(
      editingV2ProjectActions.setWeight(
        issuanceRateFrom(weight ?? DEFAULT_MINT_RATE.toString()),
      ),
    )
    dispatch(editingV2ProjectActions.setDiscountRate(discountRate ?? '0'))
    dispatch(editingV2ProjectActions.setReservedRate(reservedRate ?? '0'))

    // When setting redemption rate, also set ballotRedemptionRate
    dispatch(editingV2ProjectActions.setRedemptionRate(redemptionRate))
    dispatch(editingV2ProjectActions.setBallotRedemptionRate(redemptionRate))

    dispatch(
      editingV2ProjectActions.setReservedTokensSplits(newReservedTokensSplits),
    )

    onFinish?.()
  }, [
    dispatch,
    reservedTokensSplits,
    onFinish,
    discountRate,
    weight,
    reservedRate,
    redemptionRate,
    tokenForm,
  ])

  useEffect(() => {
    const hasFormUpdated =
      initialValues.weight !== weight ||
      initialValues.reservedRate !== reservedRate ||
      initialValues.discountRate !== discountRate ||
      initialValues.redemptionRate !== redemptionRate
    onFormUpdated?.(hasFormUpdated)
  })

  const reservedRatePercent = parseFloat(
    formatReservedRate(BigNumber.from(reservedRate)),
  )

  const discountRatePercent = parseFloat(
    formatDiscountRate(BigNumber.from(discountRate)),
  )

  // Total tokens minted as a result of a 1 ETH contribution
  const initialMintingRate = parseFloat(weight) ?? DEFAULT_MINT_RATE
  const reservedRateDecimal = reservedRatePercent * 0.01
  // Tokens received by contributor's per ETH
  const initialIssuanceRate =
    initialMintingRate - reservedRateDecimal * initialMintingRate

  const validateTotalReservedPercent = () => {
    if (getTotalSplitsPercentage(reservedTokensSplits) > 100) {
      return Promise.reject(`Reserved token recipient percentages exceed 100%.`)
    }
    return Promise.resolve()
  }

  return (
    <Form layout="vertical" onFinish={onTokenFormSaved} form={tokenForm}>
      <Space size="middle" direction="vertical">
        <div>
          <MintRateFormItem
            value={weight}
            onChange={newWeight => {
              setWeight(newWeight ?? DEFAULT_MINT_RATE.toString())
            }}
          />
          <ReservedTokensFormItem
            className="mb-2 rounded-sm bg-smoke-75 p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]"
            initialValue={reservedRatePercent}
            onChange={newReservedRatePercentage => {
              setReservedRate(
                reservedRateFrom(
                  newReservedRatePercentage?.toString() ?? '0',
                ).toString(),
              )
            }}
            reservedTokensSplits={reservedTokensSplits}
            onReservedTokensSplitsChange={setReservedTokensSplits}
            issuanceRate={parseInt(weight)}
          />

          <Form.Item
            className="mb-2 rounded-sm bg-smoke-75 p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]"
            extra={
              <DiscountRateExtra
                hasDuration={canSetDiscountRate}
                initialIssuanceRate={initialIssuanceRate}
                discountRatePercent={discountRatePercent}
                isCreate={isCreate}
              />
            }
            label={
              <SwitchHeading
                onChange={checked => {
                  setDiscountRateChecked(checked)
                  if (!checked)
                    setDiscountRate(DEFAULT_FUNDING_CYCLE_DATA.discountRate)
                }}
                checked={discountRateChecked}
                disabled={!canSetDiscountRate}
              >
                <Trans>Issuance reduction rate</Trans>
                {!discountRateChecked && canSetDiscountRate && (
                  <span className="text-grey-400 dark:text-slate-200">
                    {' '}
                    ({DEFAULT_FUNDING_CYCLE_DATA.discountRate}%)
                  </span>
                )}
              </SwitchHeading>
            }
          >
            {canSetDiscountRate && discountRateChecked && (
              <NumberSlider
                max={MAX_DISCOUNT_RATE}
                sliderValue={discountRatePercent}
                suffix="%"
                onChange={value =>
                  setDiscountRate(
                    discountRateFrom(value?.toString() ?? '0').toString(),
                  )
                }
                step={0.1}
              />
            )}
          </Form.Item>

          <FormItems.ProjectRedemptionRate
            className="mb-2 rounded-sm bg-smoke-75 p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]"
            label={
              <>
                <Trans>Redemption rate</Trans>
              </>
            }
            value={formatRedemptionRate(BigNumber.from(redemptionRate))}
            onChange={newRedemptionRatePercentage => {
              setRedemptionRate(
                redemptionRateFrom(
                  newRedemptionRatePercentage?.toString() ?? '0',
                ).toString(),
              )
            }}
            checked={canSetRedemptionRate}
            disabled={!canSetRedemptionRate}
          />
        </div>
        <ItemNoInput
          name={'totalSplitsPercentage'}
          rules={[
            {
              validator: validateTotalReservedPercent,
            },
          ]}
        />
        <Form.Item>
          <Button htmlType="submit" type="primary">
            <Trans>Save token rules</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
