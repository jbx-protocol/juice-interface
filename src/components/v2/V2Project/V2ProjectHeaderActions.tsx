import { t, Trans } from '@lingui/macro'
import { SettingOutlined, ToolOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { V2ProjectToolsDrawer } from 'components/v2/V2Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext, useState } from 'react'

import ProjectVersionBadge from 'components/ProjectVersionBadge'

import { useRouter } from 'next/router'

export default function V2ProjectHeaderActions() {
  const router = useRouter()

  const { projectId } = useContext(V2ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          color: colors.text.tertiary,
          paddingRight: 10,
        }}
      >
        {projectId && <Trans>ID: {projectId}</Trans>}{' '}
        <Tooltip
          title={t`This project uses the V2 version of the Juicebox contracts.`}
        >
          <ProjectVersionBadge versionText="V2" />
        </Tooltip>
      </span>
      <V2ProjectToolsDrawer
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
      <div style={{ display: 'flex' }}>
        <Tooltip title={t`Project Home`} placement="bottom">
          <Button
            onClick={() =>
              router.push(`/v2/p/${projectId}?page=info`, undefined, {
                shallow: true,
              })
            }
            icon={<HomeOutlined />}
            type="text"
          />
        </Tooltip>
        <Tooltip title={t`Project Settings`} placement="bottom">
          <Button
            onClick={() =>
              router.push(`/v2/p/${projectId}?page=settings`, undefined, {
                shallow: true,
              })
            }
            icon={<SettingOutlined />}
            type="text"
          />
        </Tooltip>
        <Tooltip title={t`Tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<ToolOutlined />}
            type="text"
          />
        </Tooltip>
      </div>
    </div>
  )
}
