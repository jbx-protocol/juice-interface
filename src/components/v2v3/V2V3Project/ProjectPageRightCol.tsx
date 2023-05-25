import { Trans } from '@lingui/macro'
import { Col } from 'antd'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { useNftRewardsEnabledForPay } from 'hooks/JB721Delegate/useNftRewardsEnabledForPay'
import { V2V3ProjectActivity } from './ProjectActivity'
import { V2V3PayProjectForm } from './V2V3PayProjectForm'
import { COL_SIZE_MD } from './V2V3Project'

export function ProjectPageRightCol() {
  const nftRewardsEnabled = useNftRewardsEnabledForPay()

  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <section className="mt-12 mb-6">
        <V2V3PayProjectForm />
      </section>

      <div className="flex flex-col">
        {nftRewardsEnabled ? (
          <div className="mt-6">
            <ErrorBoundaryCallout message={<Trans>NFTs failed to load.</Trans>}>
              <NftRewardsSection />
            </ErrorBoundaryCallout>
          </div>
        ) : null}
        <section className="mt-6">
          <ErrorBoundaryCallout
            message={<Trans>Project activity failed to load.</Trans>}
          >
            <V2V3ProjectActivity />
          </ErrorBoundaryCallout>
        </section>
      </div>
    </Col>
  )
}
