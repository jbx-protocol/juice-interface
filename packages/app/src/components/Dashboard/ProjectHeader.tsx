import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import Loading from 'components/shared/Loading'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectIdentifier } from 'models/project-identifier'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext, useState } from 'react'

import { useProjectMetadata } from '../../hooks/ProjectMetadata'

export default function ProjectHeader({
  project,
  projectId,
  isOwner,
}: {
  project: ProjectIdentifier & { metadata?: ProjectMetadata }
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

  const metadata = useProjectMetadata(project.link)

  const _metadata = project.metadata ?? metadata

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
            uri={_metadata?.logoUri}
            name={_metadata?.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: _metadata?.name
                ? colors.text.primary
                : colors.text.secondary,
            }}
          >
            {_metadata?.name ?? 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {project?.handle && (
                <span style={{ color: colors.text.secondary }}>
                  @{project.handle}
                </span>
              )}
              {_metadata?.infoUri && (
                <a
                  style={{ fontWeight: 400 }}
                  href={_metadata?.infoUri}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {_metadata?.infoUri}
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
