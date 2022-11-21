import { t } from '@lingui/macro'
import { formatAmount } from 'utils/formatAmount'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { ReservedTokensList } from '../../../ProjectToken/components/CustomTokenSettings/components'
import * as ProjectTokenForm from '../../../ProjectToken/hooks/ProjectTokenForm'
import { DescriptionCol } from '../DescriptionCol'
import { useProjectTokenReview } from './hooks/ProjectTokenReview'

export const MobileProjectTokenReview = () => {
  const {
    allocationSplits,
    allowTokenMinting,
    discountRate,
    redemptionRate,
    reservedRate,
    setAllocationSplits,
    weight,
  } = useProjectTokenReview()
  return (
    <>
      <DescriptionCol
        title={t`Initial mint rate`}
        desc={
          <div className="font-medium text-base">
            {formatAmount(
              weight
                ? formatIssuanceRate(weight)
                : ProjectTokenForm.DefaultSettings.initialMintRate,
            )}
          </div>
        }
      />
      <DescriptionCol
        title={t`Reserved tokens`}
        desc={
          <div className="font-medium text-base">
            {formatReservedRate(
              reservedRate
                ? reservedRate
                : ProjectTokenForm.DefaultSettings.reservedTokensPercentage.toString(),
            ) + '%'}
          </div>
        }
      />
      <DescriptionCol
        title={t`Reserved token allocation`}
        desc={
          <ReservedTokensList
            isEditable={false}
            value={allocationSplits}
            onChange={setAllocationSplits}
          />
        }
      />
      <DescriptionCol
        title={t`Discount rate`}
        desc={
          <div className="font-medium text-base">
            {formatDiscountRate(
              discountRate
                ? discountRate
                : ProjectTokenForm.DefaultSettings.discountRate.toString(),
            ) + '%'}
          </div>
        }
      />
      <DescriptionCol
        title={t`Redemption rate`}
        desc={
          <div className="font-medium text-base">
            {formatRedemptionRate(
              redemptionRate
                ? redemptionRate
                : ProjectTokenForm.DefaultSettings.redemptionRate.toString(),
            ) + '%'}
          </div>
        }
      />
      <DescriptionCol
        title={t`Allow token minting`}
        desc={<div className="font-medium text-base">{allowTokenMinting}</div>}
      />
    </>
  )
}
