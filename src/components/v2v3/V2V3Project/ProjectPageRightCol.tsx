import { Col } from 'antd'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'

import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/ErrorBoundaryCallout'
import { useNftRewardsEnabledForPay } from 'hooks/JB721Delegate/NftRewardsEnabledForPay'
import ProjectActivity from './ProjectActivity'
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
            <ProjectActivity />
          </ErrorBoundaryCallout>
        </section>
      </div>
    </Col>
  )
}
