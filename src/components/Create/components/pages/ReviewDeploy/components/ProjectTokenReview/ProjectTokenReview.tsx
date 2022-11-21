import { t } from '@lingui/macro'
import { Row } from 'antd'
import useMobile from 'hooks/Mobile'
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
import { MobileProjectTokenReview } from './MobileProjectTokenReview'

export const ProjectTokenReview = () => {
  const isMobile = useMobile()
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
      <div className="flex flex-col gap-10 pt-5 pb-12">
        {/* TODO: There is probably a more elegant solution to this */}
        {isMobile ? (
          <MobileProjectTokenReview />
        ) : (
          <>
            <Row>
              <DescriptionCol
                span={6}
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
                span={6}
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
                span={6}
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
                span={12}
                title={t`Allow token minting`}
                desc={
                  <div className="font-medium text-base">
                    {allowTokenMinting}
                  </div>
                }
              />
            </Row>
          </>
        )}
      </div>
    </>
  )
}
