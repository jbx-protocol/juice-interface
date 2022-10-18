import { t } from '@lingui/macro'
import { Row } from 'antd'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { formatPercent } from 'components/Create/utils/formatPercent'
import { splitToAllocation } from 'components/Create/utils/splitToAllocation'
import { useCallback, useMemo } from 'react'
import { useEditingReservedTokensSplits } from 'redux/hooks/EditingReservedTokensSplits'
import { formatAmount } from 'utils/formatAmount'
import { ReservedTokensList } from '../../../ProjectToken/components/CustomTokenSettings/components'
import { useProjectTokensForm } from '../../../ProjectToken/hooks/ProjectTokenForm'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'

export const ProjectTokenReview = () => {
  const { initialValues } = useProjectTokensForm()
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
    () => (initialValues.tokenMinting ? t`Yes` : t`No`),
    [initialValues.tokenMinting],
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
                {formatAmount(initialValues.initialMintRate ?? 0)}
              </div>
            }
          />
          <DescriptionCol
            span={6}
            title={t`Reserved tokens`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatPercent(initialValues.reservedTokensPercentage ?? 0)}
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
                {formatPercent(initialValues.discountRate ?? 0)}
              </div>
            }
          />
          <DescriptionCol
            span={6}
            title={t`Redemption rate`}
            desc={
              <div style={emphasisedTextStyle()}>
                {formatPercent(initialValues.redemptionRate ?? 0)}
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
