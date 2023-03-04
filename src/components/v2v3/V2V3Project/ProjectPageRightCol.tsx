import { Col } from 'antd'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'

import ProjectActivity from './ProjectActivity'
import { V2V3PayProjectForm } from './V2V3PayProjectForm'
import { COL_SIZE_MD } from './V2V3Project'

export function ProjectPageRightCol() {
  const { value: hasNftRewards } = useHasNftRewards()
  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <section className="mt-12 mb-6">
        <V2V3PayProjectForm />
      </section>

      <div className="flex flex-col">
        {hasNftRewards ? (
          <div className="mt-6">
            <NftRewardsSection />
          </div>
        ) : null}
        <section className="mt-6">
          <ProjectActivity />
        </section>
      </div>
    </Col>
  )
}
