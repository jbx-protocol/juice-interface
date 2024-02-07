import { t } from '@lingui/macro'
import { ReservedTokensList } from 'components/v2v3/shared/ReservedTokensList'
import { formatAmount } from 'utils/format/formatAmount'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import * as ProjectTokenForm from '../../../ProjectToken/hooks/useProjectTokenForm'
import { ReviewDescription } from '../ReviewDescription'
import { useProjectTokenReview } from './hooks/useProjectTokenReview'

export const ProjectTokenReview = () => {
  const {
    allocationSplits,
    allowTokenMinting,
    pauseTransfers,
    discountRate,
    redemptionRate,
    reservedRate,
    setAllocationSplits,
    weight,
  } = useProjectTokenReview()

  return (
    <div className="flex flex-col gap-y-10 pt-5 pb-12 md:grid md:grid-cols-4">
      <ReviewDescription
        title={t`Total issuance rate`}
        desc={
          <div className="text-base font-medium">
            {formatAmount(
              weight
                ? formatIssuanceRate(weight)
                : ProjectTokenForm.DefaultSettings.initialMintRate,
            )}
          </div>
        }
      />
      <ReviewDescription
        title={t`Reserved rate`}
        desc={
          <div className="text-base font-medium">
            {formatReservedRate(
              reservedRate
                ? reservedRate
                : ProjectTokenForm.DefaultSettings.reservedTokensPercentage.toString(),
            ) + '%'}
          </div>
        }
      />
      <ReviewDescription
        className="col-span-2"
        title={t`Reserved token recipients`}
        desc={
          <ReservedTokensList
            value={allocationSplits}
            onChange={setAllocationSplits}
          />
        }
      />
      <ReviewDescription
        title={t`Issuance reduction rate`}
        desc={
          <div className="text-base font-medium">
            {formatDiscountRate(
              discountRate
                ? discountRate
                : ProjectTokenForm.DefaultSettings.discountRate.toString(),
            ) + '%'}
          </div>
        }
      />
      <ReviewDescription
        title={t`Redemption rate`}
        desc={
          <div className="text-base font-medium">
            {formatRedemptionRate(
              redemptionRate
                ? redemptionRate
                : ProjectTokenForm.DefaultSettings.redemptionRate.toString(),
            ) + '%'}
          </div>
        }
      />
      <ReviewDescription
        title={t`Owner token minting`}
        desc={<div className="text-base font-medium">{allowTokenMinting}</div>}
      />

      <ReviewDescription
        title={t`Token transfers`}
        desc={<div className="text-base font-medium">{pauseTransfers}</div>}
      />
    </div>
  )
}
