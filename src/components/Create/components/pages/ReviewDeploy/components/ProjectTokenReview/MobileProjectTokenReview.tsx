import { t } from '@lingui/macro'
import { formatAmount } from 'utils/format/formatAmount'
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
    pauseTransfers,
  } = useProjectTokenReview()
  return (
    <>
      <DescriptionCol
        title={t`Issuance rate`}
        desc={
          <div className="text-base font-medium">
            {formatAmount(
              weight
                ? formatIssuanceRate(weight)
                : ProjectTokenForm.DefaultSettings.initialMintRate,
            )}{' '}
            / 1 ETH
          </div>
        }
      />
      <DescriptionCol
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
      <DescriptionCol
        title={t`Reserved token recipients`}
        desc={
          <ReservedTokensList
            isEditable={false}
            value={allocationSplits}
            onChange={setAllocationSplits}
          />
        }
      />
      <DescriptionCol
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
      <DescriptionCol
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
      <DescriptionCol
        title={t`Owner token minting`}
        desc={<div className="text-base font-medium">{allowTokenMinting}</div>}
      />
      <DescriptionCol
        title={t`Token transfers`}
        desc={<div className="text-base font-medium">{pauseTransfers}</div>}
      />
    </>
  )
}
