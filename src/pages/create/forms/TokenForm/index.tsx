import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import ReservedTokensFormItem from 'pages/create/forms/TokenForm/ReservedTokensFormItem'
import { round } from 'lodash'
import { ItemNoInput } from 'components/formItems/ItemNoInput'

import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  defaultFundingCycleData,
  defaultFundingCycleMetadata,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'

import { sanitizeSplit } from 'utils/v2/splits'

import { Split } from 'models/v2/splits'

import {
  DEFAULT_MINT_RATE,
  discountRateFrom,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2/math'

import { BigNumber } from '@ethersproject/bignumber'

import { FormItems } from 'components/formItems'

import {
  getDefaultFundAccessConstraint,
  hasDistributionLimit,
  hasFundingDuration,
} from 'utils/v2/fundingCycle'

import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import SwitchHeading from 'components/SwitchHeading'

import NumberSlider from 'components/inputs/NumberSlider'

import FormItemWarningText from 'components/FormItemWarningText'
import { formattedNum } from 'utils/formatNumber'
import { DEFAULT_BONDING_CURVE_RATE_PERCENTAGE } from 'components/formItems/ProjectRedemptionRate'

import { DISCOUNT_RATE_EXPLANATION } from 'components/v2/V2Project/V2FundingCycleSection/settingExplanations'
import { getTotalSplitsPercentage } from 'utils/v2/distributions'
import { useForm } from 'antd/lib/form/Form'

import { shadowCard } from 'constants/styles/shadowCard'
import TabDescription from '../../TabDescription'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
    <div style={{ fontSize: '0.9rem' }}>
      {!hasDuration && (
        <FormItemWarningText>
          <Trans>
            Disabled when your project's funding cycle has no duration.
          </Trans>
        </FormItemWarningText>
      )}
      <p>{DISCOUNT_RATE_EXPLANATION}</p>
      {discountRatePercent > 0 && isCreate && (
        <>
          <TabDescription
            style={{ marginTop: 20, backgroundColor: colors.background.l1 }}
          >
            <p>
              <Trans>
                Contributors will receive{' '}
                <strong>{discountRatePercent}%</strong> more tokens for
                contributions they make this funding cycle compared to the next
                funding cycle.
              </Trans>
            </p>
            <p>
              <Trans>
                The <strong>issuance rate</strong> of your second funding cycle
                will be{' '}
                <strong style={{ whiteSpace: 'nowrap' }}>
                  {formattedNum(secondIssuanceRate)} tokens per 1 ETH
                </strong>
                , then{' '}
                <strong style={{ whiteSpace: 'nowrap' }}>
                  {formattedNum(thirdIssuanceRate)} tokens per 1 ETH{' '}
                </strong>
                for your third funding cycle, and so on.
              </Trans>
            </p>
          </TabDescription>
        </>
      )}
    </div>
  )
}

export default function TokenForm({
  onFormUpdated,
  onFinish,
  isCreate,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
  isCreate?: boolean // If the instance of this form is in the create flow (not reconfig)
}) {
  const {
    theme,
    theme: { colors },
  } = useContext(ThemeContext)

  const [tokenForm] = useForm<{ totalReservedSplitPercent: number }>()

  const dispatch = useAppDispatch()
  const {
    fundingCycleMetadata,
    fundingCycleData,
    reservedTokensGroupedSplits,
    fundAccessConstraints,
  } = useAppSelector(state => state.editingV2Project)
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
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
        defaultFundingCycleMetadata.reservedRate,
      discountRate:
        (canSetDiscountRate && fundingCycleData?.discountRate) ||
        defaultFundingCycleData.discountRate,
      redemptionRate:
        (canSetRedemptionRate && fundingCycleMetadata?.redemptionRate) ||
        defaultFundingCycleMetadata.redemptionRate,
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
    fundingCycleData?.discountRate !== defaultFundingCycleData.discountRate,
  )

  const [redemptionRateChecked, setRedemptionRateChecked] = useState<boolean>(
    fundingCycleMetadata?.redemptionRate !==
      defaultFundingCycleMetadata.redemptionRate,
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
    dispatch(editingV2ProjectActions.setRedemptionRate(redemptionRate))
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
      initialValues.reservedRate !== reservedRate ||
      initialValues.discountRate !== discountRate ||
      initialValues.redemptionRate !== redemptionRate
    onFormUpdated?.(hasFormUpdated)
  })

  const defaultValueStyle: CSSProperties = {
    color: colors.text.tertiary,
  }

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
      return Promise.reject(`Reserved allocations exceed 100%.`)
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
            hasDuration={hasDuration}
            isCreate={Boolean(isCreate)}
          />
          <ReservedTokensFormItem
            initialValue={reservedRatePercent}
            onChange={newReservedRatePercentage => {
              setReservedRate(
                reservedRateFrom(
                  newReservedRatePercentage?.toString() ?? '0',
                ).toString(),
              )
            }}
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
            reservedTokensSplits={reservedTokensSplits}
            onReservedTokensSplitsChange={setReservedTokensSplits}
            issuanceRate={parseInt(weight)}
          />

          <Form.Item
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
                    setDiscountRate(defaultFundingCycleData.discountRate)
                }}
                checked={discountRateChecked}
                disabled={!canSetDiscountRate}
              >
                <Trans>Discount rate</Trans>
                {!discountRateChecked && canSetDiscountRate && (
                  <span style={defaultValueStyle}>
                    {' '}
                    ({defaultFundingCycleData.discountRate}%)
                  </span>
                )}
              </SwitchHeading>
            }
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
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
            label={
              <>
                <Trans>Redemption rate</Trans>
                {!redemptionRateChecked && canSetRedemptionRate && (
                  <span style={defaultValueStyle}>
                    {' '}
                    ({DEFAULT_BONDING_CURVE_RATE_PERCENTAGE}%)
                  </span>
                )}
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
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
            onToggled={setRedemptionRateChecked}
            checked={redemptionRateChecked}
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
            <Trans>Save token configuration</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
