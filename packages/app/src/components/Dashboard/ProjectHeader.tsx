import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import ProjectToolDrawerModal from 'components/modals/ProjectToolDrawerModal'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

export default function ProjectHeader() {
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)
  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const { projectId, handle, metadata, isOwner } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 120

  if (!projectId) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: 20, height: '100%' }}>
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2.4rem',
                margin: 0,
                color: metadata?.name
                  ? colors.text.primary
                  : colors.text.placeholder,
              }}
            >
              {metadata?.name || 'Untitled project'}
            </h1>

            <div>
              <Button
                onClick={() => setToolDrawerVisible(true)}
                icon={<ToolOutlined />}
                type="text"
              ></Button>
              {isOwner && (
                <Button
                  onClick={() => setEditProjectModalVisible(true)}
                  icon={<SettingOutlined />}
                  type="text"
                ></Button>
              )}
            </div>
          </div>

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

          {metadata?.description && (
            <p style={{ color: colors.text.tertiary }}>
              {metadata?.description}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            marginLeft: 20,
          }}
        >
          <div
            style={{
              color: colors.text.tertiary,
              textAlign: 'right',
              paddingRight: 10,
            }}
          >
            ID: {projectId.toNumber()}
          </div>
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

      <ProjectToolDrawerModal
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
    </div>
  )
}
