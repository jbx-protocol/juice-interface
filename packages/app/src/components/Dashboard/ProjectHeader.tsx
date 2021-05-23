import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext, useState } from 'react'

export default function ProjectHeader({
  project,
  projectId,
  isOwner,
}: {
  project: ProjectIdentifier
  projectId: BigNumber
  isOwner?: boolean
}) {
  const [
    editProjectModalVisible,
    setEditProjectModalVisible,
  ] = useState<boolean>(false)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 80

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
              color: project.name ? colors.text.primary : colors.text.secondary,
            }}
          >
            {project.name ? project.name : 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {project?.handle && (
                <span style={{ color: colors.text.secondary }}>
                  @{project.handle}
                </span>
              )}
              {project?.link && (
                <a
                  style={{ fontWeight: 400 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.link}
                </a>
              )}
            </Space>
          </h3>
        </div>

        <div
          style={{
            height: headerHeight,
            marginLeft: 20,
          }}
        >
          {isOwner && (
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            ></Button>
          )}
        </div>
      </div>

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
