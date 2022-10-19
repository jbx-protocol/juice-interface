import { t } from '@lingui/macro'
import { Row } from 'antd'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { splitToAllocation } from 'components/Create/utils/splitToAllocation'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { useEditingReservedTokensSplits } from 'redux/hooks/EditingReservedTokensSplits'
import { formatAmount } from 'utils/formatAmount'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { ReservedTokensList } from '../../../ProjectToken/components/CustomTokenSettings/components'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'

export const ProjectTokenReview = () => {
  const {
    fundingCycleData: { weight, discountRate },
    fundingCycleMetadata: { allowMinting, reservedRate, redemptionRate },
  } = useAppSelector(state => state.editingV2Project)
  const [tokenSplits, setTokenSplits] = useEditingReservedTokensSplits()

  const allocationSplits = useMemo(
    () => tokenSplits.map(splitToAllocation),
    [tokenSplits],
  )
  const setAllocationSplits = useCallback(
    (splits: AllocationSplit[]) => setTokenSplits(splits),
    [setTokenSplits],
  )

  const allowTokenMinting = useMemo(
    () => (allowMinting ? t`Yes` : t`No`),
    [allowMinting],
  )

  return (
    <>
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
            title={t`Initial mint rate`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatAmount(formatIssuanceRate(weight) ?? 0)}
              </div>
            }
          />
          <DescriptionCol
            span={6}
            title={t`Reserved tokens`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatReservedRate(reservedRate) + '%'}
              </div>
            }
          />
          <DescriptionCol
            span={12}
            title={t`Reserved token allocation`}
            desc={
              <ReservedTokensList
                isEditable={false}
                value={allocationSplits}
                onChange={setAllocationSplits}
              />
            }
          />
        </Row>
        <Row>
          <DescriptionCol
            span={6}
            title={t`Discount rate`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatDiscountRate(discountRate) + '%'}
              </div>
            }
          />
          <DescriptionCol
            span={6}
            title={t`Redemption rate`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatRedemptionRate(redemptionRate) + '%'}
              </div>
            }
          />
          <DescriptionCol
            span={12}
            title={t`Allow token minting`}
            desc={<div style={emphasisedTextStyle()}>{allowTokenMinting}</div>}
          />
        </Row>
      </div>
    </>
  )
}
