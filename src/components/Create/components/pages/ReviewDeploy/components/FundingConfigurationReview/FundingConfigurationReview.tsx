import { t } from '@lingui/macro'
import { Row } from 'antd'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import { formatFundingTarget } from 'components/Create/utils/formatFundingTarget'
import { splitToAllocation } from 'components/Create/utils/splitToAllocation'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { useAvailablePayoutsSelections } from '../../../Payouts/hooks'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'

export const FundingConfigurationReview = () => {
  const { fundingCycleData, payoutsSelection } = useAppSelector(
    state => state.editingV2Project,
  )
  const [distributionLimit] = useEditingDistributionLimit()
  const [payoutSplits, setPayoutSplits] = useEditingPayoutSplits()

  const fundingCycles = useMemo(
    () => (fundingCycleData.duration == '0' ? t`Manual` : t`Automated`),
    [fundingCycleData.duration],
  )

  const duration = useMemo(
    () => formatFundingCycleDuration(fundingCycleData.duration),
    [fundingCycleData.duration],
  )

  const fundingTarget = useMemo(
    () =>
      formatFundingTarget({
        distributionLimitWad: distributionLimit?.amount,
        distributionLimitCurrency: distributionLimit?.currency.toString(),
      }),
    [distributionLimit?.amount, distributionLimit?.currency],
  )

  const availableSelections = useAvailablePayoutsSelections()
  const selection = useMemo(() => {
    const overrideSelection =
      availableSelections.size === 1 ? [...availableSelections][0] : undefined
    return overrideSelection || payoutsSelection
  }, [availableSelections, payoutsSelection])

  const payoutsText = useMemo(() => {
    return selection === 'amounts' ? t`Amounts` : t`Percentages`
  }, [selection])

  const allocationSplits = useMemo(
    () => payoutSplits.map(splitToAllocation),
    [payoutSplits],
  )
  const setAllocationSplits = useCallback(
    (splits: AllocationSplit[]) => setPayoutSplits(splits),
    [setPayoutSplits],
  )

  return (
    <div
      style={{
        ...flexColumnStyle,
        gap: '2.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      <Row>
        <DescriptionCol
          span={6}
          title={t`Funding cycles`}
          desc={<div style={emphasisedTextStyle()}>{fundingCycles}</div>}
        />
        <DescriptionCol
          span={6}
          title={t`Duration`}
          desc={
            duration ? (
              <div style={emphasisedTextStyle()}>{duration}</div>
            ) : null
          }
        />
        <DescriptionCol
          span={6}
          title={t`Funding target`}
          desc={<div style={emphasisedTextStyle()}>{fundingTarget}</div>}
        />
      </Row>
      <Row>
        <DescriptionCol
          span={6}
          title={t`Payouts`}
          // TODO: Add support for this to show correct value - we probably need to borrow code from the FundingTarget component
          desc={<div style={emphasisedTextStyle()}>{payoutsText}</div>}
        />
        <DescriptionCol
          span={18}
          title={t`Payout addresses`}
          desc={
            <PayoutsList
              value={allocationSplits}
              onChange={setAllocationSplits}
              payoutsSelection={selection ?? 'amounts'}
              isEditable={false}
            />
          }
        />
      </Row>
    </div>
  )
}
