import {
  SettingOutlined,
  ToolOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import { Button, Space } from 'antd'
import Discord from 'components/icons/Discord'
import EditProjectModal from 'components/modals/EditProjectModal'
import ProjectToolDrawerModal from 'components/modals/ProjectToolDrawerModal'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { useContext, useState } from 'react'
import RichNote from './ProjectActivity/RichNote'

export default function ProjectHeader() {
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)
  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const { projectId, handle, metadata, isPreviewMode, isArchived } = useContext(
    ProjectContext,
  )

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 120

  const hasEditPermission = useHasPermission([
    OperatorPermission.SetHandle,
    OperatorPermission.SetUri,
  ])

  const prettyUrl = (url: string) => {
    if (url.startsWith('https://')) {
      return url.split('https://')[1]
    } else if (url.startsWith('http://')) {
      return url.split('http://')[1]
    } else return url
  }

  const completeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    } else {
      return 'http://' + url
    }
  }

  if (!projectId) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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

          <h3>
            <Space size="large">
              {isArchived && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: colors.text.disabled,
                    textTransform: 'uppercase',
                  }}
                >
                  (archived)
                </span>
              )}
              {handle && (
                <span style={{ color: colors.text.secondary }}>@{handle}</span>
              )}
              {metadata?.infoUri && (
                <a
                  style={{ fontWeight: 400 }}
                  href={completeUrl(metadata.infoUri)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {prettyUrl(metadata.infoUri)}
                </a>
              )}
              {metadata?.twitter && (
                <a
                  style={{ fontWeight: 400 }}
                  href={completeUrl(metadata.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{ marginRight: 4 }}>
                    <TwitterOutlined />
                  </span>
                  @{prettyUrl(metadata.twitter)}
                </a>
              )}
              {metadata?.discord && (
                <a
                  style={{
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  href={completeUrl(metadata.discord)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{ display: 'flex', marginRight: 4 }}>
                    <Discord size={13} />
                  </span>
                  {prettyUrl(metadata.discord)}
                </a>
              )}
            </Space>
          </h3>
          <RichNote note={metadata?.description} />
        </div>

        {!isPreviewMode && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  color: colors.text.tertiary,
                  paddingRight: 10,
                }}
              >
                ID: {projectId.toNumber()}
              </div>

              <div>
                <Button
                  onClick={() => setToolDrawerVisible(true)}
                  icon={<ToolOutlined />}
                  type="text"
                ></Button>
                {hasEditPermission && (
                  <Button
                    onClick={() => setEditProjectModalVisible(true)}
                    icon={<SettingOutlined />}
                    type="text"
                  ></Button>
                )}
              </div>
            </div>
          </div>
        )}
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
