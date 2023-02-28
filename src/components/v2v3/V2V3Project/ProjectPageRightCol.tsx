import { Col } from 'antd'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import ProjectActivity from './ProjectActivity'
import { COL_SIZE_MD } from './V2V3Project'

export function ProjectPageRightCol({
  hasNftRewards,
}: {
  hasNftRewards: boolean
}) {
  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <section className="mt-12">
        <PayProjectForm />
      </section>

      <div className="flex flex-col">
        {hasNftRewards ? (
          <div className="mt-12">
            <NftRewardsSection />
          </div>
        ) : null}
        <section className="mt-5">
          <ProjectActivity />
        </section>
      </div>
    </Col>
  )
}
