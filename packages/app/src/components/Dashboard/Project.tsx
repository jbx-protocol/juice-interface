import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Row, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import { CardSection } from 'components/shared/CardSection'
import { colors } from 'constants/styles/colors'
import { Budget } from 'models/budget'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { CSSProperties, useState } from 'react'

import FundingTerm from './FundingTerm'
import OwnerControls from './OwnerControls'
import Pay from './Pay'
import Rewards from './Rewards'

export default function Project({
  project,
  projectId,
  budget,
  showCurrentDetail,
  style,
  isOwner,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  isOwner: boolean
  budget: Budget | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)

  if (!projectId || !project) return null

  const gutter = 30

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          marginBottom: gutter,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: project?.name ? colors.juiceOrange : '#ffffff44',
            }}
          >
            {project?.name ? project.name : 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {project?.handle ? (
                <span style={{ color: colors.grape }}>@{project.handle}</span>
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

        <div>
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
          <Rewards projectId={projectId} />

          <div style={{ marginTop: gutter }}>
            <Pay budget={budget} projectId={projectId} project={project} />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <CardSection>
            <div style={{ padding: 20 }}>
              <OwnerControls projectId={projectId} budget={budget} />
            </div>

            <FundingTerm budget={budget} showDetail={showCurrentDetail} />
          </CardSection>
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
