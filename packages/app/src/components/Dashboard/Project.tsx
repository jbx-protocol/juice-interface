import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Row, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import { CardSection } from 'components/shared/CardSection'
import ProjectLogo from 'components/shared/ProjectLogo'
import { colors } from 'constants/styles/colors'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { CSSProperties, useState } from 'react'

import Funding from './Funding'
import Pay from './Pay'
import Rewards from './Rewards'

export default function Project({
  project,
  projectId,
  fundingCycle,
  showCurrentDetail,
  style,
  isOwner,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  isOwner: boolean
  fundingCycle: FundingCycle | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const [
    editProjectModalVisible,
    setEditProjectModalVisible,
  ] = useState<boolean>(false)

  if (!projectId || !project) return null

  const gutter = 40
  const headerHeight = 80

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: gutter,
        }}
      >
        <div style={{ marginRight: 20 }}>
          <ProjectLogo
            uri={project?.logoUri}
            name={project?.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: project.name ? colors.bodyPrimary : colors.bodySecondary,
            }}
          >
            {project.name ? project.name : 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {project?.handle ? (
                <span style={{ color: colors.bodySecondary }}>
                  @{project.handle}
                </span>
              ) : null}
              {project?.link ? (
                <a
                  style={{ fontWeight: 400 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.link}
                </a>
              ) : null}
            </Space>
          </h3>
        </div>

        <div
          style={{
            height: headerHeight,
            marginLeft: 20,
          }}
        >
          {isOwner ? (
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            ></Button>
          ) : null}
        </div>
      </div>

      <Row gutter={gutter}>
        <Col xs={24} md={12}>
          <CardSection padded>
            <Funding
              projectId={projectId}
              fundingCycle={fundingCycle}
              showDetail={showCurrentDetail}
              isOwner={isOwner}
            />
          </CardSection>
        </Col>

        <Col xs={24} md={12}>
          <Pay
            fundingCycle={fundingCycle}
            projectId={projectId}
            project={project}
          />

          <div style={{ marginTop: gutter }}>
            <Rewards projectId={projectId} />
          </div>
        </Col>
      </Row>

      <EditProjectModal
        visible={editProjectModalVisible}
        projectId={projectId}
        project={project}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
