import { t } from '@lingui/macro'
import { Row } from 'antd'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { formatFundingCycle } from 'components/Create/utils/formatFundingCycle'
import { formatFundingTarget } from 'components/Create/utils/formatFundingTarget'
import { useAppSelector } from 'hooks/AppSelector'
import { Split } from 'models/splits'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'

export const FundingConfigurationReview = () => {
  const { fundingCycleData } = useAppSelector(state => state.editingV2Project)
  const [distributionLimit] = useEditingDistributionLimit()
  const [payoutSplits, setPayoutSplits] = useEditingPayoutSplits()

  const fundingCycles = useMemo(
    () => (fundingCycleData.duration == '0' ? t`Manual` : t`Automated`),
    [fundingCycleData.duration],
  )

  const duration = useMemo(
    () => formatFundingCycle(fundingCycleData.duration),
    [fundingCycleData.duration],
  )

  const fundingTarget = useMemo(
    () =>
      formatFundingTarget({
        distributionLimit: distributionLimit?.amount.toString(),
        distributionLimitCurrency: distributionLimit?.currency.toString(),
      }),
    [distributionLimit?.amount, distributionLimit?.currency],
  )

  const splitToAllocation = useCallback((split: Split): AllocationSplit => {
    return {
      id: `${split.beneficiary}${split.projectId ? `-${split.projectId}` : ''}`,
      ...split,
    }
  }, [])

  const allocationSplits = useMemo(
    () => payoutSplits.map(splitToAllocation),
    [payoutSplits, splitToAllocation],
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
          desc={<div style={emphasisedTextStyle()}>{'Amounts'}</div>}
        />
        <DescriptionCol
          span={18}
          title={t`Payout addresses`}
          desc={
            <PayoutsList
              value={allocationSplits}
              onChange={setAllocationSplits}
              payoutsSelection="amounts"
              isEditable={false}
            />
          }
        />
      </Row>
    </div>
  )
}
