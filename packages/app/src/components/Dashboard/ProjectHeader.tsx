import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext, useState } from 'react'

export default function ProjectHeader({
  handle,
  metadata,
  projectId,
  isOwner,
}: {
  handle: string
  metadata: ProjectMetadata
  projectId: BigNumber
  isOwner?: boolean
}) {
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 120

  return (
    <div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div style={{ marginRight: 20, height: '100%' }}>
          <ProjectLogo
            uri={metadata.logoUri}
            name={metadata.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: metadata.name
                ? colors.text.primary
                : colors.text.placeholder,
            }}
          >
            {metadata.name || 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {handle && (
                <span style={{ color: colors.text.secondary }}>@{handle}</span>
              )}
              {metadata?.infoUri && (
                <a
                  style={{ fontWeight: 400 }}
                  href={
                    metadata.infoUri.startsWith('http://') ||
                    metadata.infoUri.startsWith('https://')
                      ? metadata.infoUri
                      : 'http://' + metadata.infoUri
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {metadata.infoUri}
                </a>
              )}
            </Space>
          </h3>

          {metadata.description && (
            <p style={{ color: colors.text.tertiary }}>
              {metadata.description}
            </p>
          )}
        </div>

        <div
          style={{
            height: headerHeight,
            display: 'flex',
            alignItems: 'baseline',
            marginLeft: 20,
          }}
        >
          <div style={{ color: colors.text.tertiary }}>
            ID: {projectId.toNumber()}
          </div>
          {isOwner && (
            <Button
              style={{ marginLeft: 20 }}
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
        metadata={metadata}
        handle={handle}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
