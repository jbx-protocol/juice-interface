import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import { V2ProjectToolsDrawer } from 'components/v2/V2Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'

export default function V2ProjectHeaderActions() {
  const { projectId, handle } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

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
        <Tooltip title={t`Tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<ToolOutlined />}
            type="text"
          />
        </Tooltip>

        {canReconfigure && (
          <Tooltip title={t`Project Settings`} placement="bottom">
            <div>
              <Link href={settingsPagePath('general', { handle, projectId })}>
                <Button type="link" icon={<SettingOutlined />} />
              </Link>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
